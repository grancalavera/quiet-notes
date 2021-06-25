import create, { State } from "zustand";

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
