import { Callout, Classes } from "@blueprintjs/core";
import { truncate } from "lodash";
import React from "react";
import { block } from "../app/bem";
import { formatDate } from "../date/format";
import { useNotebookState } from "./notebook-local-state";
import { Note } from "./notebook-model";
import "./notebook-notes-list.scss";
import { useNotesCollection } from "./notebook-server-state";

const b = block("notes-list");

export const NotesList = () => {
  const [notes] = useNotesCollection();

  return notes ? (
    <div className={b()}>
      {notes.map((note) => (
        <NotePreview note={note} key={note.id} />
      ))}
    </div>
  ) : null;
};

const NotePreview = ({ note }: { note: Note }) => {
  const selectedNoteId = useNotebookState((s) => s.selectedNoteId);
  const selectNote = useNotebookState((s) => s.selectNote);
  const isSelected = note.id === selectedNoteId;

  return (
    <Callout
      className={b("list-item", { isSelected }).toString()}
      intent={isSelected ? "primary" : "none"}
      icon="document"
      onClick={() => selectNote(note.id)}
      title={truncate(note.title, { length: 25 }) || "New Note"}
    >
      <p className={b("list-item-detail").mix(Classes.TEXT_SMALL, Classes.TEXT_MUTED)}>
        {note._createdAt && <span>Created {formatDate(note._createdAt)}</span>}
        <br />
        {note._updatedAt && <span>Modified {formatDate(note._updatedAt)}</span>}
      </p>
    </Callout>
  );
};
