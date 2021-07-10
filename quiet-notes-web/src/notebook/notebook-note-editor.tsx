import { NonIdealState, TextArea } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { block } from "../app/bem";
import { useNotebookState, useUpdateNote } from "./notebook-local-state";
import "./notebook-note-editor.scss";
import { useNote } from "./notebook-server-state";
const b = block("note-editor");

export const NoteEditorContainer = () => {
  const selectedNoteId = useNotebookState((s) => s.selectedNoteId);
  return selectedNoteId ? (
    <NoteEditor noteId={selectedNoteId} key={selectedNoteId} />
  ) : (
    <NonIdealNoteEditor />
  );
};

const NoteEditor = (props: { noteId: string }) => {
  const [draft, setDraft] = useState("");

  const [note] = useNote(props.noteId);
  const [debouncedDraft] = useDebounce(draft, 1000);
  const updateNote = useUpdateNote();

  useEffect(() => {
    setDraft((current) => (current === note?.content ? current : note?.content ?? ""));
  }, [note?.content]);

  useEffect(() => {
    if (note && debouncedDraft && note.content !== debouncedDraft) {
      updateNote(note, debouncedDraft);
    }
  }, [debouncedDraft, note, updateNote]);

  return (
    <div className={b()}>
      <TextArea value={draft} onChange={(e) => setDraft(e.target.value)} fill />
    </div>
  );
};

const NonIdealNoteEditor = () => (
  <NonIdealState
    icon="warning-sign"
    title="Select an existing note or create a new note"
  />
);
