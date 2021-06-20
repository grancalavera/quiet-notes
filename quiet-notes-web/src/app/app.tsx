import { Button, Callout, EditableText } from "@blueprintjs/core";
import React from "react";
import create, { State } from "zustand";
import { loremIpsum } from "../app/lorem-ipsum";
import { signIn, useAuthState } from "../firebase/firebase";
import { CenterLayout } from "../layout/center-layout";
import { NotebookLayout } from "../layout/notebook-layout";
import { Note } from "../notebook/notebook-model";
import { useNotesCollection } from "../notebook/use-notes-collection";

export const App = () => {
  const [user] = useAuthState();
  return user ? (
    <NotebookContainer />
  ) : (
    <CenterLayout>
      <Button large onClick={signIn}>
        Sign In with Google
      </Button>
    </CenterLayout>
  );
};

interface NotebookState extends State {
  selectedNote?: string;
  selectNote: (id: string) => void;
  deselectNote: () => void;
}

const useNotebookState = create<NotebookState>((set) => ({
  selectNote: (selectedNote) => set({ selectedNote }),
  deselectNote: () => set(({ selectedNote, ...state }) => state, true),
}));

const NotebookContainer = () => {
  return (
    <NotebookLayout
      sidebar={<NotesList />}
      content={<EditableText multiline defaultValue={loremIpsum} onChange={() => {}} />}
    />
  );
};

const NotesList = () => {
  const [notes] = useNotesCollection();

  return notes ? (
    <div className="bp3-running-text" style={{ marginTop: 10 }}>
      {notes.map((note) => (
        <NotePreview note={note} key={note.id} />
      ))}
    </div>
  ) : null;
};

const NotePreview = ({ note }: { note: Note }) => {
  const selectedNote = useNotebookState((s) => s.selectedNote);
  const selectNote = useNotebookState((s) => s.selectNote);
  const isSelected = note.id === selectedNote;

  return (
    <Callout
      icon={isSelected ? "tick" : "blank"}
      onClick={() => selectNote(note.id)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {note.content}
    </Callout>
  );
};
