import create, { State } from "zustand";
import {
  isMergeSuccess,
  mergeNote,
  MergeNoteConflict,
  Note,
  resolveMergeConflict,
} from "./notebook-model";

interface NotebookEditorState {
  note: Note | undefined;
  mergeConflict: MergeNoteConflict | undefined;
  loadNote: (note: Note) => void;
  updateContent: (content: string) => void;
  reset: () => void;
  resolveConflict: (choice: "local" | "incoming") => void;
}

const useNotebookEditorState = create<NotebookEditorState & State>((set, get) => ({
  note: undefined,
  mergeConflict: undefined,

  loadNote: (incoming) => {
    const local = get().note;

    if (!local || local.id !== incoming.id) {
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

  resolveConflict: (choice) => {
    const mergeConflict = get().mergeConflict;

    if (mergeConflict) {
      const note = resolveMergeConflict(choice, mergeConflict);
      set(({ mergeConflict, ...s }) => ({ ...s, note }), true);
    }
  },

  updateContent: (content) => {
    const note = get().note;
    if (note) {
      set({ note: { ...note, content } });
    }
  },

  reset: () => set(({ note, mergeConflict, ...s }) => s, true),
}));

const noteSelector = (s: NotebookEditorState) => s.note;
export const useNoteState = () => useNotebookEditorState(noteSelector);

const loadNoteSelector = (s: NotebookEditorState) => s.loadNote;
export const useLoadNote = () => useNotebookEditorState(loadNoteSelector);

const resetSelector = (s: NotebookEditorState) => s.reset;
export const useReset = () => useNotebookEditorState(resetSelector);

const updateContentSelector = (s: NotebookEditorState) => s.updateContent;
export const useUpdateContent = () => useNotebookEditorState(updateContentSelector);

const mergeConflictSelector = (s: NotebookEditorState) => s.mergeConflict;
export const useMergeConflict = () => useNotebookEditorState(mergeConflictSelector);

const resolveConflictSelector = (s: NotebookEditorState) => s.resolveConflict;
export const useResolveConflict = () => useNotebookEditorState(resolveConflictSelector);
