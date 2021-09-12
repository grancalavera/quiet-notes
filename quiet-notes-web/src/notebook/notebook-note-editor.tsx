import { NonIdealState, TextArea } from "@blueprintjs/core";
import { useDebounceCallback } from "@react-hook/debounce";
import { useEffect, useRef } from "react";
import { block } from "../app/bem";
import { useNote, useUpdateNote } from "../notebook-service/notebook-service";
import {
  useLoadNote,
  useNoteState,
  useReset,
  useUpdateContent,
} from "./notebook-editor-state";
import "./notebook-note-editor.scss";
import { useSelectedNoteId } from "./notebook-state";

const b = block("note-editor");

export const NoteEditorContainer = () => {
  const selectedNoteId = useSelectedNoteId();

  return selectedNoteId ? (
    <NoteEditor noteId={selectedNoteId} />
  ) : (
    <NonIdealState
      icon="warning-sign"
      title="Select an existing note or create a new one"
    />
  );
};

const NoteEditor = ({ noteId }: { noteId: string }) => {
  const [remoteNote] = useNote(noteId);
  const localNote = useNoteState();
  const loadNote = useLoadNote();
  const updateContent = useUpdateContent();
  const { mutate: updateNote } = useUpdateNote();
  const reset = useReset();
  const updateNoteDebounced = useDebounceCallback(updateNote, 1000);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const shouldUpdate = !!localNote && localNote.content !== remoteNote?.content;

    if (shouldUpdate) {
      updateNoteDebounced(localNote);
    }
  }, [remoteNote?.content, localNote, updateNoteDebounced]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    remoteNote && loadNote(remoteNote);
  }, [remoteNote, loadNote]);

  useEffect(() => () => reset(), [reset]);

  return (
    <div className={b()}>
      <TextArea
        inputRef={inputRef}
        value={localNote?.content ?? ""}
        onChange={(e) => updateContent(e.target.value)}
        fill
      />
    </div>
  );
};
