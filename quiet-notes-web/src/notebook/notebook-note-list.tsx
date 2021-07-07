import { Button, H6 } from "@blueprintjs/core";
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
    <div className={b("list-item").toString()} onClick={() => selectNote(note.id)}>
      <div className={b("list-item-detail", { isSelected })}>
        <H6 className={b("note-title")}>{note.title || "New Note"}</H6>
        <Button
          className={b("delete-note").toString()}
          icon="trash"
          minimal
          onClick={(
            e:
              | React.MouseEvent<HTMLButtonElement, MouseEvent>
              | React.MouseEvent<HTMLElement, MouseEvent>
          ) => {
            e.stopPropagation();
          }}
        />
      </div>
    </div>
  );
};
