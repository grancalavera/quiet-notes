import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import create, { State } from "zustand";
import { deriveTitle, Note } from "./notebook-model";

interface NotebookState {
  notes: Note[];
  loadNotes: (notes: Note[]) => void;
  sortType: "ByTitleAsc" | "ByTitleDesc" | "ByDateAsc" | "ByDateDesc";
  changeSortType: (sortType: NotebookSortType) => void;
}

export type NotebookSortType = NotebookState["sortType"];

const useNotebookState = create<NotebookState & State>((set, get) => ({
  notes: [],
  sortType: "ByDateDesc",
  changeSortType: (sortType) =>
    set({ sortType, notes: sortNotes(sortType, get().notes) }),
  loadNotes: (notes) => set({ notes: sortNotes(get().sortType, notes) }),
}));

const sortNotes = (sortType: NotebookSortType, [...notes]: Note[]): Note[] =>
  notes.sort(sort[sortType]);

const sort: Record<NotebookSortType, (a: Note, b: Note) => number> = {
  ByDateAsc: (a, b) => {
    const da = a._createdAt?.getTime() ?? 0;
    const db = b._createdAt?.getTime() ?? 0;
    return da - db;
  },
  ByDateDesc: (a, b) => {
    const da = a._createdAt?.getTime() ?? 0;
    const db = b._createdAt?.getTime() ?? 0;
    return db - da;
  },
  ByTitleAsc: (a, b) => {
    const ta = deriveTitle(a);
    const tb = deriveTitle(b);
    return ta < tb ? -1 : tb < ta ? 1 : 0;
  },
  ByTitleDesc: (a, b) => {
    const ta = deriveTitle(a);
    const tb = deriveTitle(b);
    return ta < tb ? 1 : tb < ta ? -1 : 0;
  },
};

export const useSelectedNoteId = () => useParams<{ noteId?: string }>().noteId;

export const useSelectNote = () => {
  const history = useHistory();

  return useCallback(
    (noteId: string) => {
      history.push(`/notebook/${noteId}`);
    },
    [history]
  );
};

export const useDeselectNote = () => {
  const history = useHistory();

  return useCallback(() => {
    history.push("/notebook");
  }, [history]);
};

const selectSortType = (s: NotebookState) => s.sortType;
export const useSortType = () => useNotebookState(selectSortType);

const selectChangeSortType = (s: NotebookState) => s.changeSortType;
export const useChangeSortType = () => useNotebookState(selectChangeSortType);

const selectNotes = (s: NotebookState) => s.notes;
export const useNotebookNotes = () => useNotebookState(selectNotes);

const selectLoadNotes = (s: NotebookState) => s.loadNotes;
export const useLoadNotes = () => useNotebookState(selectLoadNotes);
