import { trim } from "lodash";
import { useCallback } from "react";
import create, { State } from "zustand";
import { useUserInfo } from "../firebase/firebase";
import { assertNever } from "../utils/assert-never";
import { Note, writeNoteStub, writeNoteUpdate } from "./notebook-model";
import { upsertNote } from "./notebook-server-state";

export interface NotebookState extends State {
  selectedNoteId?: string;
  selectNote: (id: string) => void;
  deselectNote: () => void;
  reset: () => void;
}

export const useNotebookState = create<NotebookState>((set, get) => ({
  selectNote: (selectedNote) => set({ selectedNoteId: selectedNote }),
  deselectNote: () => set(({ selectedNoteId, ...state }) => state, true),
  reset: () => {
    get().deselectNote();
  },
}));

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

export interface NoteEditorState extends State {
  editor: Editor;
  open: (note: Note) => void;
  close: () => void;
  change: (content: string) => void;
  save: () => Promise<void>;
  isLoading: boolean;
}

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

export const useNoteEditorState = create<NoteEditorState>((set, get) => ({
  editor: editorIdle,
  isLoading: false,
  open: (note) => set({ editor: noteUntouched(note) }),
  close: () => set({ editor: editorIdle }),
  change: (draft) => {
    const editor = get().editor;
    switch (editor.kind) {
      case "EditorIdle":
        break;
      case "NoteUntouched":
        if (editor.note.content !== draft) {
          set({ editor: noteDraft(editor.note, draft) });
        }
        break;
      case "NoteDraft":
        if (editor.note.content === draft) {
          set({ editor: noteUntouched(editor.note) });
        } else {
          set({ editor: noteDraft(editor.note, draft) });
        }
        break;
      default:
        assertNever(editor);
    }
  },
  save: async () => {
    const editor = get().editor;
    if (editor.kind === "NoteDraft") {
      set({ isLoading: true });
      const content = editor.draft;
      const title = deriveNoteTitle(content);
      const note = { ...editor.note, content, title };
      const write = writeNoteUpdate(note);
      await upsertNote(write);
      set({ editor: mergeNote(get().editor, note), isLoading: false });
    }
  },
}));

const deriveNoteTitle = (content: string): string => trim(content.split("\n")[0] ?? "");

const mergeNote = (editor: Editor, note: Note): Editor => {
  if (editor.kind === "EditorIdle") {
    return editor;
  } else if (note.content === editor.draft) {
    return noteUntouched(note);
  } else {
    return noteDraft(note, editor.draft);
  }
};
