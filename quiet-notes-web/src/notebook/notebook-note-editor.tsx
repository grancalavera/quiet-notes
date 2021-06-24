import { Button, EditableText, NonIdealState } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { block } from "../app/bem";
import { useNote } from "./notebook-hooks";
import "./notebook-note-editor.scss";
import { useNotebookState } from "./notebook-state";
import { useCreateNote } from "./notebook-use-create-note";

const b = block("note-editor");

export const NoteEditorContainer = () => {
  const selectedNote = useNotebookState((s) => s.selectedNote);
  return selectedNote ? <NoteEditor noteId={selectedNote} /> : <NonIdealNoteEditor />;
};

const NoteEditor = (props: { noteId: string }) => {
  const [draft, setDraft] = useState("");

  const [note] = useNote(props.noteId);

  useEffect(() => {
    setDraft((current) => (current === note?.content ? current : note?.content ?? ""));
  }, [note?.content]);

  return (
    <div className={b()}>
      <EditableText
        className={b("editable-text").toString()}
        value={draft}
        onChange={setDraft}
      />
    </div>
  );
};

const NonIdealNoteEditor = () => {
  const [createNote, isLoading] = useCreateNote();

  return (
    <NonIdealState
      icon="new-object"
      action={
        <Button minimal onClick={createNote} loading={isLoading}>
          Create Note
        </Button>
      }
    />
  );
};
