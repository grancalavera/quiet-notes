import { trim } from "lodash";
import { useCallback, useEffect } from "react";
import create, { State } from "zustand";
import { AppError } from "../app/app-error";
import { useUserInfo } from "../firebase/firebase";
import { assertNever } from "../utils/assert-never";
import { Note } from "./notebook-model";
import {
  deleteNote,
  updateNote,
  useCreateNote as useFirebaseCreateNote,
} from "./notebook-server-state";

export const useCreateNote = () => {
  const author = useUserInfo();
  const selectNote = useNotebookState((s) => s.selectNote);
  const handleError = useNotebookState((s) => s.handleError);

  const [createNote, , error] = useFirebaseCreateNote();

  useEffect(() => {
    error && handleError(error);
  }, [error, handleError]);

  return useCallback(async () => {
    const id = await createNote(author);
    id && selectNote(id);
  }, [selectNote, author, createNote]);
};

export type Editor = EditorIdle | NoteUntouched | NoteDraft;

export interface EditorIdle {
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

export interface NotebookState extends State {
  errors: AppError[];
  handleError: (error: AppError) => void;
  dismissError: () => void;

  selectedNoteId?: string;
  selectNote: (id: string) => void;
  closeNote: () => void;
  editor: Editor;
  open: (note: Note) => void;
  change: (content: string) => void;
  save: () => Promise<void>;
  isSaving: boolean;
}

export const useNotebookState = create<NotebookState>((set, get) => ({
  errors: [],
  handleError: (error) => set(({ errors }) => ({ errors: [...errors, error] })),
  dismissError: () => set(({ errors }) => ({ errors: errors.slice(1) })),

  selectNote: (selectedNoteId) => {
    const editor = get().editor;

    if (editor.kind !== "EditorIdle" && editor.draft === "") {
      deleteNote(editor.note.id);
    }

    set({ selectedNoteId });
  },
  editor: editorIdle,
  isSaving: false,
  open: (note) => set({ editor: openNote(get().editor, note) }),
  closeNote: () =>
    set(
      ({ selectedNoteId, editor, isSaving, ...state }) => ({
        editor: editorIdle,
        isSaving: false,
        ...state,
      }),
      true
    ),
  change: (draft) => set({ editor: changeNote(get().editor, draft) }),
  save: async () => {
    const editor = get().editor;
    if (editor.kind === "NoteDraft") {
      set({ isSaving: true });
      const content = editor.draft;
      const title = deriveNoteTitle(content);
      const note = { ...editor.note, content, title };
      await updateNote(note);
      set({ editor: mergeNote(get().editor, note), isSaving: false });
    }
  },
}));
