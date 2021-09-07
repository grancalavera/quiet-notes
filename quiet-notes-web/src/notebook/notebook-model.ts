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

export const chooseLocal = (value: MergeNoteConflict): Note => ({
  ...value.local,
  _version: value.version,
});

export const chooseIncoming = (value: MergeNoteConflict): Note => ({
  ...value.incoming,
  _version: value.version,
});
