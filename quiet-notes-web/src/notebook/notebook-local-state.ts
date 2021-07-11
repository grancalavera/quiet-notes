import { trim } from "lodash";
import { useCallback } from "react";
import create, { State } from "zustand";
import { useUserInfo } from "../firebase/firebase";
import { assertNever } from "../utils/assert-never";
import { Note, writeNoteStub, writeNoteUpdate } from "./notebook-model";
import { upsertNote } from "./notebook-server-state";

export interface NotebookState extends State {
  //
  selectedNoteId?: string;
  selectNote: (id: string) => void;
  deselectNote: () => void;
  reset: () => void;
  //
  editor: Editor;
  open: (note: Note) => void;
  close: () => void;
  change: (content: string) => void;
  save: () => Promise<void>;
  isSaving: boolean;
}

export const useCreateNote = () => {
  const author = useUserInfo();
  const selectNote = useNotebookState((s) => s.selectNote);

  return useCallback(() => {
    const note = writeNoteStub(author);
    selectNote(note.id);
    upsertNote(note);
  }, [selectNote, author]);
};

export const useUpdateNote = () => {
  return useCallback((current: Note, content: string) => {
    const title = trim(content.split("\n")[0] ?? "");
    const note = writeNoteUpdate({ ...current, content, title });
    upsertNote(note);
  }, []);
};

type Editor = EditorIdle | NoteUntouched | NoteDraft;

interface EditorIdle {
  kind: "EditorIdle";
}

interface NoteUntouched {
  kind: "NoteUntouched";
  note: Note;
  draft: string;
}

interface NoteDraft {
  kind: "NoteDraft";
  note: Note;
  draft: string;
}

const editorIdle: Editor = { kind: "EditorIdle" };

const noteUntouched = (note: Note): Editor => ({
  kind: "NoteUntouched",
  note,
  draft: note.content,
});

const noteDraft = (note: Note, draft: string): Editor => ({
  kind: "NoteDraft",
  note,
  draft,
});

const deriveNoteTitle = (content: string): string => trim(content.split("\n")[0] ?? "");

const changeNote = (editor: Editor, draft: string): Editor => {
  switch (editor.kind) {
    case "EditorIdle":
      return editor;
    case "NoteUntouched":
      if (editor.note.content === draft) {
        return editor;
      } else {
        return noteDraft(editor.note, draft);
      }
    case "NoteDraft":
      if (editor.note.content === draft) {
        return noteUntouched(editor.note);
      } else {
        return noteDraft(editor.note, draft);
      }
    default:
      assertNever(editor);
  }
};

const mergeNote = (editor: Editor, note: Note): Editor => {
  if (editor.kind === "EditorIdle") {
    return editor;
  } else if (note.content === editor.draft) {
    return noteUntouched(note);
  } else {
    return noteDraft(note, editor.draft);
  }
};

const openNote = (editor: Editor, note: Note): Editor => {
  switch (editor.kind) {
    case "EditorIdle":
      return noteUntouched(note);
    case "NoteDraft":
    case "NoteUntouched":
      if (editor.note.id === note.id) {
        return editor;
      } else {
        return noteUntouched(note);
      }
    default:
      assertNever(editor);
  }
};

export const useNotebookState = create<NotebookState>((set, get) => ({
  //
  selectNote: (selectedNoteId) => set({ selectedNoteId }),
  deselectNote: () => set(({ selectedNoteId, ...state }) => state, true),
  reset: () => get().deselectNote(),
  //
  editor: editorIdle,
  isSaving: false,
  open: (note) => set({ editor: openNote(get().editor, note) }),
  close: () => set({ editor: editorIdle }),
  change: (draft) => set({ editor: changeNote(get().editor, draft) }),
  save: async () => {
    const editor = get().editor;
    if (editor.kind === "NoteDraft") {
      set({ isSaving: true });
      const content = editor.draft;
      const title = deriveNoteTitle(content);
      const note = { ...editor.note, content, title };
      const write = writeNoteUpdate(note);
      await upsertNote(write);
      set({ editor: mergeNote(get().editor, note), isSaving: false });
    }
  },
}));
