import create, { State } from "zustand";
import { isMergeSuccess, mergeNote, MergeNoteConflict, Note } from "./notebook-model";

interface NotebookEditorState {
  note: Note | undefined;
  mergeConflict: MergeNoteConflict | undefined;
  loadNote: (note: Note) => void;
  updateContent: (content: string) => void;
  reset: () => void;
}

const useNotebookEditorState = create<NotebookEditorState & State>((set, get) => ({
  note: undefined,
  mergeConflict: undefined,
  loadNote: (incoming) => {
    const local = get().note;

    if (!local) {
      set({ note: incoming });
    } else {
      const result = mergeNote(local, incoming);
      if (isMergeSuccess(result)) {
        set({ note: result.note });
      } else {
        set({ mergeConflict: result });
      }
    }
  },
  updateContent: (content) => {
    const note = get().note;
    if (note) {
      set({ note: { ...note, content } });
    }
  },
  reset: () => set(({ note, ...s }) => s, true),
}));

const selectNote = (s: NotebookEditorState) => s.note;
export const useNoteState = () => useNotebookEditorState(selectNote);

const selectLoadNote = (s: NotebookEditorState) => s.loadNote;
export const useLoadNote = () => useNotebookEditorState(selectLoadNote);

const selectReset = (s: NotebookEditorState) => s.reset;
export const useReset = () => useNotebookEditorState(selectReset);

const selectUpdateContent = (s: NotebookEditorState) => s.updateContent;
export const useUpdateContent = () => useNotebookEditorState(selectUpdateContent);

const selectMergeConflict = (s: NotebookEditorState) => s.mergeConflict;
export const useMergeConflict = () => useNotebookEditorState(selectMergeConflict);
