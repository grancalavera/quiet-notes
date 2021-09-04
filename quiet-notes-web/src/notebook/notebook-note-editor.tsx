import { NonIdealState, Spinner, TextArea } from "@blueprintjs/core";
import { useEffect, useRef } from "react";
import { block } from "../app/bem";
import { CenterLayout } from "../layout/center-layout";
import { useNote } from "../notebook-service/notebook-service";
import { Note } from "./notebook-model";
import "./notebook-note-editor.scss";
import { useNotebookState } from "./notebook-state";

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
  const [note] = useNote(props.noteId);

  return (
    <div className={b()}>
      {note ? (
        <NoteDraft note={note} />
      ) : (
        <CenterLayout>
          <Spinner />{" "}
        </CenterLayout>
      )}
    </div>
  );
};

interface NoteDraftProps {
  note: Note;
}

const NoteDraft = ({ note }: NoteDraftProps) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <TextArea inputRef={inputRef} value={note.content} onChange={() => {}} fill />;
};

const NonIdealNoteEditor = () => (
  <NonIdealState
    icon="warning-sign"
    title="Select an existing note or create a new note"
  />
);
