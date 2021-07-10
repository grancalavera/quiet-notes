import { Callout } from "@blueprintjs/core";
import React from "react";
import { block } from "../app/bem";
import { useAuthState } from "../firebase/firebase";
import { useNotebookState } from "./notebook-local-state";
import { ReadNote } from "./notebook-model";
import "./notebook-notes-list.scss";
import { useNotesCollection } from "./notebook-server-state";

const b = block("notes-list");

export const NotesList = () => {
  const [user] = useAuthState();
  const [notes] = useNotesCollection(user);

  return notes ? (
    <div className={b()}>
      {notes.map((note) => (
        <NotePreview note={note} key={note.id} />
      ))}
    </div>
  ) : null;
};

const NotePreview = ({ note }: { note: ReadNote }) => {
  const selectedNoteId = useNotebookState((s) => s.selectedNoteId);
  const selectNote = useNotebookState((s) => s.selectNote);
  const isSelected = note.id === selectedNoteId;

  return (
    <Callout
      className={b("list-item", { isSelected }).toString()}
      intent={isSelected ? "primary" : "none"}
      icon="document"
      onClick={() => selectNote(note.id)}
      title={note.title || "New Note"}
    >
      <p>A snippet from the note...</p>
    </Callout>
  );
};
