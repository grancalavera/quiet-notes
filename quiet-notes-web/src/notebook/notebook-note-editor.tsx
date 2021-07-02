import { EditableText, NonIdealState } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { block } from "../app/bem";
import { useNotebookState } from "./notebook-local-state";
import "./notebook-note-editor.scss";
import { useNote } from "./notebook-server-state";
const b = block("note-editor");

export const NoteEditorContainer = () => {
  const selectedNote = useNotebookState((s) => s.selectedNote);
  return selectedNote ? <NoteEditor noteId={selectedNote} /> : <NonIdealNoteEditor />;
};

const NoteEditor = (props: { noteId: string }) => {
  const [draft, setDraft] = useState("");

  const [note] = useNote(props.noteId);
  const [update] = useDebounce(draft, 1000);

  useEffect(() => {
    setDraft((current) => (current === note?.content ? current : note?.content ?? ""));
  }, [note?.content]);

  useEffect(() => {
    console.log("updated note:", update);
  }, [update]);

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

const NonIdealNoteEditor = () => (
  <NonIdealState
    icon="warning-sign"
    title="Select an existing note or create a new note"
  />
);
