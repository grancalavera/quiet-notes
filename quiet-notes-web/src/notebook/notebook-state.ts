import create, { State } from "zustand";

export interface NotebookState {
  selectedNoteId?: string;
  selectNote: (id: string) => void;
  deselectNote: () => void;
}

const useNotebookState = create<NotebookState & State>((set) => ({
  selectNote: (selectedNoteId) => set({ selectedNoteId }),
  deselectNote: () => set(({ selectedNoteId, ...s }) => s, true),
}));

const _selectedNoteId = (s: NotebookState) => s.selectedNoteId;
export const useSelectedNoteId = () => useNotebookState(_selectedNoteId);

const _selectNote = (s: NotebookState) => s.selectNote;
export const useSelectNote = () => useNotebookState(_selectNote);

const _deselectNote = (s: NotebookState) => s.deselectNote;
export const useDeselectNote = () => useNotebookState(_deselectNote);
