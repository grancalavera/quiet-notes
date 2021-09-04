import create, { State } from "zustand";

export interface NotebookState {
  selectedNoteId?: string;
  selectNote: (id: string) => void;
  deselectNote: () => void;
}

export const useNotebookState = create<NotebookState & State>((set) => ({
  selectNote: (selectedNoteId) => set({ selectedNoteId }),
  deselectNote: () => set(({ selectedNoteId, ...s }) => s, true),
}));
