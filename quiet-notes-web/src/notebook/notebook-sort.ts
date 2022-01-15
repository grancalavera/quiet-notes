import { deriveTitle, Note } from "./notebook-model";

export type NotebookSortType = "ByTitleAsc" | "ByTitleDesc" | "ByDateAsc" | "ByDateDesc";

export const sortNotes = (sortType: NotebookSortType, [...notes]: Note[]): Note[] =>
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
