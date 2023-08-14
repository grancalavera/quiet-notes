import { nanoid } from "nanoid";
import { clientId } from "../app/app-model";
import { Clock, initialize } from "../crdt/clock";

export type NoteId = string;

export interface Note {
  readonly id: NoteId;
  readonly content: string;
  readonly author: string;
  readonly clock: Clock;
  readonly _version: number;
  readonly _createdAt?: Date;
  readonly _updatedAt?: Date;
}

export const createNote = (author: string, content: string = ""): Note => ({
  id: nanoid(),
  content,
  author,
  clock: initialize(clientId),
  _version: 0,
});

export const deriveTitle = (note: Note): string => {
  return note.content.trimStart().split("\n")[0] || "untitled";
};

export const hasCreatedDate = (candidate: Note): boolean =>
  candidate._createdAt !== undefined;

export type NotebookSortType =
  | "ByTitleAsc"
  | "ByTitleDesc"
  | "ByDateAsc"
  | "ByDateDesc";

export const sortNotes = (
  sortType: NotebookSortType,
  [...notes]: Note[]
): Note[] => notes.sort(sort[sortType]);

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
