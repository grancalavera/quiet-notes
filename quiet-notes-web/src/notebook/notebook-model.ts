export type NoteId = string;

export interface Note {
  id: NoteId;
  content: string;
  author: string;
  _version: number;
  _createdAt?: Date;
  _updatedAt?: Date;
}

export type NoteWithDates = Required<Note>;

export type MergeNote = MergeNoteConflict | MergeNoteSuccess;

interface MergeNoteSuccess {
  kind: "MergeNoteSuccess";
  note: Note;
}

export interface MergeNoteConflict {
  kind: "MergeNoteConflict";
  version: number;
  local: Note;
  incoming: Note;
}

export const isMergeSuccess = (candidate: MergeNote): candidate is MergeNoteSuccess =>
  candidate.kind === "MergeNoteSuccess";

export const mergeNoteSuccess = (value: Omit<MergeNoteSuccess, "kind">): MergeNote => ({
  kind: "MergeNoteSuccess",
  ...value,
});

export const mergeNoteConflict = (value: Omit<MergeNoteConflict, "kind">): MergeNote => ({
  kind: "MergeNoteConflict",
  ...value,
});

export const mergeNote = (local: Note, incoming: Note): MergeNote =>
  local.content === incoming.content
    ? mergeNoteSuccess({
        note: local._version <= incoming._version ? incoming : local,
      })
    : mergeNoteConflict({
        version: Math.max(local._version, incoming._version),
        local,
        incoming,
      });

export const resolveMergeConflict = (
  choice: "local" | "incoming",
  mergeConflict: MergeNoteConflict
): Note => ({
  ...(choice === "local" ? mergeConflict.local : mergeConflict.incoming),
  _version: mergeConflict.version,
});

export const deriveTitle = (note: Note): string => {
  return note.content.trimStart().split("\n")[0] ?? "";
};

export const isNoteWithDates = (candidate: Note): candidate is NoteWithDates =>
  candidate._createdAt !== undefined && candidate._updatedAt !== undefined;

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
