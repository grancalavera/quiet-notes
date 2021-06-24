import { Callout } from "@blueprintjs/core";
import React from "react";
import { useAuthState } from "../firebase/firebase";
import { useNotesCollection } from "./notebook-hooks";
import { ReadNote } from "./notebook-model";
import { useNotebookState } from "./notebook-state";
import "./notebook-notes-list.scss";

import { block } from "../app/bem";

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
  const selectedNote = useNotebookState((s) => s.selectedNote);
  const selectNote = useNotebookState((s) => s.selectNote);
  const isSelected = note.id === selectedNote;

  return (
    <Callout
      className={b("preview").toString()}
      icon={isSelected ? "star" : "star-empty"}
      onClick={() => selectNote(note.id)}
      style={{ cursor: "pointer", userSelect: "none" }}
      intent={isSelected ? "success" : "none"}
    >
      {note.title || "New Note"}
    </Callout>
  );
};
