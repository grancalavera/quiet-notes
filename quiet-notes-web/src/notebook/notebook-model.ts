export interface Note {
  id: string;
  title: string;
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
