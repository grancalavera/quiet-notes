import { NonIdealState, TextArea } from "@blueprintjs/core";
import React, { useEffect } from "react";
import { block } from "../app/bem";
import { useNotebookState, useNoteEditorState } from "./notebook-local-state";
import "./notebook-note-editor.scss";
import { useNoteOnce } from "./notebook-server-state";
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
  const openNote = useNoteEditorState((s) => s.open);
  const isEditorIdle = useNoteEditorState((s) => s.editor.kind === "EditorIdle");

  const [note] = useNoteOnce(props.noteId);

  useEffect(() => {
    if (note && isEditorIdle) {
      openNote(note);
    }
  }, [note, openNote, isEditorIdle]);

  return (
    <div className={b()}>
      <NoteDraft />
    </div>
  );
};

const NoteDraft = () => {
  const editorState = useNoteEditorState((s) => s.editor);
  const changeDraft = useNoteEditorState((s) => s.change);

  return (
    <>
      {editorState.kind !== "EditorIdle" && (
        <TextArea
          value={editorState.draft}
          onChange={(e) => changeDraft(e.target.value)}
          fill
        />
      )}
    </>
  );
};

const NonIdealNoteEditor = () => (
  <NonIdealState
    icon="warning-sign"
    title="Select an existing note or create a new note"
  />
);
