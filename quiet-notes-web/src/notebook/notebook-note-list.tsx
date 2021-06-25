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
