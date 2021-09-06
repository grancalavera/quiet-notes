export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  _version: number;
  _createdAt?: Date;
  _updatedAt?: Date;
}

export type UpdateNoteResult = UpdatedNoteChoice | UpdatedNote;

interface UpdatedNote {
  kind: "UpdatedNote";
  note: Note;
}

interface UpdatedNoteChoice {
  kind: "UpdatedNoteChoice";
  version: number;
  local: Note;
  incoming: Note;
}

export const resolveNoteUpdate = (local: Note, incoming: Note): UpdateNoteResult => {
  if (local.content === incoming.content) {
    return {
      kind: "UpdatedNote",
      note: local._version <= incoming._version ? incoming : local,
    };
  } else {
    return {
      kind: "UpdatedNoteChoice",
      version: Math.max(local._version, incoming._version),
      local,
      incoming,
    };
  }
};

export const chooseLocal = (choice: UpdatedNoteChoice): Note => ({
  ...choice.local,
  _version: choice.version,
});

export const chooseIncoming = (choice: UpdatedNoteChoice): Note => ({
  ...choice.incoming,
  _version: choice.version,
});
