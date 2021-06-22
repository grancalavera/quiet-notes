import { Button } from "@blueprintjs/core";
import firebase from "firebase/app";
import React from "react";
import { useUserInfo } from "../firebase/firebase";
import { noteCollectionRef, useNote } from "./notebook-hooks";
import { createNoteDraft } from "./notebook-model";
import { useNotebookState } from "./notebook-state";

export const NoteEditorContainer = () => {
  const author = useUserInfo();
  const selectNote = useNotebookState((s) => s.selectNote);
  const selectedNote = useNotebookState((s) => s.selectedNote);

  const createNote = async () => {
    const result = await noteCollectionRef.add({
      ...createNoteDraft(author!),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    selectNote(result.id);
  };

  return (
    <div>
      <div>
        <Button icon="add" minimal onClick={createNote} />
      </div>
      {selectedNote && <NoteEditor noteId={selectedNote} />}
    </div>
  );
};

const NoteEditor = (props: { noteId: string }) => {
  const [note] = useNote(props.noteId);
  return <div>{note?.content}</div>;
};
