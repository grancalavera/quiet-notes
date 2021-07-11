import { NonIdealState, TextArea } from "@blueprintjs/core";
import React, { useEffect } from "react";
import { block } from "../app/bem";
import { useNotebookState } from "./notebook-local-state";
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
  const openNote = useNotebookState((s) => s.open);

  const [note] = useNoteOnce(props.noteId);

  useEffect(() => {
    note && openNote(note);
  }, [note, openNote]);

  return (
    <div className={b()}>
      <NoteDraft />
    </div>
  );
};

const NoteDraft = () => {
  const editorState = useNotebookState((s) => s.editor);
  const changeDraft = useNotebookState((s) => s.change);

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
