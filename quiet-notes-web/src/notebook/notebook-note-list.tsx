import { Callout } from "@blueprintjs/core";
import { truncate } from "lodash";
import React from "react";
import { block } from "../app/bem";
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
      <p>
        {note._createdAt && <span>created: {note._createdAt.toISOString()}</span>}
        <br />
        {note._updatedAt && <span>updated: {note._updatedAt.toISOString()}</span>}
      </p>
    </Callout>
  );
};
