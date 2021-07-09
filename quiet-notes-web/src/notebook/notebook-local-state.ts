import { trim } from "lodash";
import { useCallback } from "react";
import create, { State } from "zustand";
import { useUserInfo } from "../firebase/firebase";
import { Note, writeNoteStub, writeNoteUpdate } from "./notebook-model";
import { upsertNote } from "./notebook-server-state";
export interface NotebookState extends State {
  selectedNote?: string;
  selectNote: (id: string) => void;
  deselectNote: () => void;
  reset: () => void;
}

export const useNotebookState = create<NotebookState>((set, get) => ({
  selectNote: (selectedNote) => set({ selectedNote }),
  deselectNote: () => set(({ selectedNote, ...state }) => state, true),
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
