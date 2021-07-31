import { NonIdealState, Spinner, TextArea } from "@blueprintjs/core";
import { useEffect, useRef } from "react";
import { block } from "../app/bem";
import { CenterLayout } from "../layout/center-layout";
import { Editor, EditorIdle, useNotebookState } from "./notebook-local-state";
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
  const [note, isLoading] = useNoteOnce(props.noteId);

  useEffect(() => {
    note && openNote(note);
  }, [note, openNote]);

  return (
    <div className={b()}>
      {isLoading ? (
        <CenterLayout>
          <Spinner />{" "}
        </CenterLayout>
      ) : (
        <NoteDraft />
      )}
    </div>
  );
};

const isEditorIdle = (editor: Editor): editor is EditorIdle =>
  editor.kind === "EditorIdle";

const NoteDraft = () => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const editorState = useNotebookState((s) => s.editor);
  const changeDraft = useNotebookState((s) => s.change);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <TextArea
      inputRef={inputRef}
      value={isEditorIdle(editorState) ? "" : editorState.draft}
      onChange={(e) => changeDraft(e.target.value)}
      fill
    />
  );
};

const NonIdealNoteEditor = () => (
  <NonIdealState
    icon="warning-sign"
    title="Select an existing note or create a new note"
  />
);
