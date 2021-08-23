import create, { State } from "zustand";
import { assertNever } from "../utils/assert-never";
import { Note } from "./notebook-model";

export type Editor = EditorIdle | EditorUntouched | EditorDraft;

export interface EditorIdle {
  kind: "EditorIdle";
}

interface EditorUntouched {
  kind: "EditorUntouched";
  note: Note;
  draft: string;
}

interface EditorDraft {
  kind: "EditorDraft";
  note: Note;
  draft: string;
}

const editorIdle: Editor = { kind: "EditorIdle" };

const editorUntouched = (note: Note): Editor => ({
  kind: "EditorUntouched",
  note,
  draft: note.content,
});

export const editorDraft = (note: Note, draft: string): Editor => ({
  kind: "EditorDraft",
  note,
  draft,
});

export const stateFromDraft = (state: Editor, draft: string): Editor => {
  switch (state.kind) {
    case "EditorIdle":
      return state;
    case "EditorUntouched":
      return state;
    case "EditorDraft":
      return state;
    default:
      assertNever(state);
  }
};

export interface NotebookState extends State {
  selectedNoteId?: string;
  selectNote: (id: string) => void;
  deselectNote: () => void;
}

export interface NoteEditorState extends State {
  state: EditorIdle | EditorUntouched | EditorDraft;
  openNote: (note: Note) => void;
  updateDraft: (draft: string) => void;
}

export const useNotebookState = create<NotebookState>((set, get) => ({
  selectNote: (selectedNoteId) => set({ selectedNoteId }),
  deselectNote: () => {
    set(({ selectedNoteId, ...s }) => s, true);
    return undefined;
  },
}));

export const useNoteEditorState = create<NoteEditorState>((set) => ({
  state: editorIdle,
  openNote: (note) => set({ state: editorUntouched(note) }),
  updateDraft: () => {},
}));
