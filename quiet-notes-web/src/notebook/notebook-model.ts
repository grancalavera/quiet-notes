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
  const hasEdits = local.content !== incoming.content;
  const validSequence = local._version === incoming._version - 1;

  if (hasEdits && validSequence) {
    return {
      kind: "UpdatedNote",
      note: { ...incoming, content: local.content, title: local.title },
    };
  } else if (hasEdits && !validSequence) {
    const version = Math.max(local._version, incoming._version);
    return { kind: "UpdatedNoteChoice", version, local, incoming };
  } else {
    return { kind: "UpdatedNote", note: incoming };
  }
};
