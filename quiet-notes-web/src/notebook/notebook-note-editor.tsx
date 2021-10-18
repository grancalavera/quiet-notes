import { TextArea } from "@blueprintjs/core";
import { useDebounceCallback } from "@react-hook/debounce";
import { useEffect, useRef } from "react";
import { isFirebaseError } from "../app/app-error";
import { useErrorHandler } from "../app/app-state";
import { block } from "../app/bem";
import { CreateNoteButton } from "../components/CreateNoteButton";
import { CenterLayout } from "../layout/center-layout";
import { useNote, useUpdateNote } from "../notebook-service/notebook-service";
import {
  useLoadNote,
  useNoteState,
  useReset,
  useUpdateContent,
} from "./notebook-editor-state";
import "./notebook-note-editor.scss";
import { useDeselectNote, useSelectedNoteId } from "./notebook-state";

const b = block("note-editor");

export const NoteEditorContainer = () => {
  const selectedNoteId = useSelectedNoteId();

  return selectedNoteId ? (
    <NoteEditor noteId={selectedNoteId} />
  ) : (
    <CenterLayout>
      <CreateNoteButton showLabel />
    </CenterLayout>
  );
};

const NoteEditor = ({ noteId }: { noteId: string }) => {
  const defaultHandleError = useErrorHandler();
  const deselectNote = useDeselectNote();
  const [remoteNote] = useNote(noteId, {
    handleError: (error) => {
      if (isFirebaseError(error) && error.code === "permission-denied") {
        deselectNote();
      } else {
        defaultHandleError(error);
      }
    },
  });
  const localNote = useNoteState();
  const loadNote = useLoadNote();
  const updateContent = useUpdateContent();
  const { mutate: updateNote } = useUpdateNote();
  const reset = useReset();
  const updateNoteDebounced = useDebounceCallback(updateNote, 1000);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (localNote && localNote.content !== remoteNote?.content) {
      updateNoteDebounced(localNote);
    }
  }, [remoteNote?.content, localNote, updateNoteDebounced]);

  useEffect(() => inputRef.current?.focus(), [noteId]);

  useEffect(() => remoteNote && loadNote(remoteNote), [remoteNote, loadNote]);
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
