import create, { State } from "zustand";

export interface NotebookState extends State {
  selectedNote?: string;
  selectNote: (id: string) => void;
  deselectNote: () => void;
}

export const useNotebookState = create<NotebookState>((set) => ({
  selectNote: (selectedNote) => set({ selectedNote }),
  deselectNote: () => set(({ selectedNote, ...state }) => state, true),
}));
