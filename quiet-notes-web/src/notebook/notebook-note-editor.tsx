import { NonIdealState, TextArea } from "@blueprintjs/core";
import { useDebounceCallback } from "@react-hook/debounce";
import { useEffect, useRef } from "react";
import { block } from "../app/bem";
import { useNote, useUpdateNote } from "../notebook-service/notebook-service";
import { useLoadNote, useNoteState, useUpdateContent } from "./notebook-editor-state";
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
  const loadNote = useLoadNote();
  const localNote = useNoteState();
  const updateContent = useUpdateContent();
  const { mutate } = useUpdateNote();
  const updateNote = useDebounceCallback(mutate, 1000);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const shouldUpdate = !!localNote && localNote.content !== remoteNote?.content;

    if (shouldUpdate) {
      updateNote(localNote);
    }
  }, [remoteNote?.content, localNote, updateNote]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    remoteNote && loadNote(remoteNote);
  }, [remoteNote, loadNote]);

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
