export interface Note {
  id: string;
  content: string;
  author: string;
  _version: number;
  _createdAt?: Date;
  _updatedAt?: Date;
}

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

export const sortBySelectedId = (selectedNoteId: string) => (left: Note, right: Note) => {
  if (left.id === selectedNoteId) {
    return -1;
  } else if (right.id === selectedNoteId) {
    return 1;
  } else {
    return 0;
  }
};
