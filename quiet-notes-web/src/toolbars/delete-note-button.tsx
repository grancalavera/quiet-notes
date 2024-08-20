import { useEffect } from "react";
import { handleUnknownError } from "../app/app-error-state";
import { isFailure, isLoading, isSuccess } from "../lib/async-result";
import { useNoteExists } from "../note/note-state";
import {
  useCloseDeletedNote,
  useDeleteNote,
  useIsNoteOpen,
} from "../notebook/notebook-state-v2";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const DeleteNoteButton = ({ noteId }: { noteId: string }) => {
  const { mutate: deleteNote, result, reset } = useDeleteNote();
  const isNoteOpen = useIsNoteOpen(noteId);
  const doesNoteExist = useNoteExists(noteId);

  useEffect(() => {
    isFailure(result) && handleUnknownError(result.error);
    (isSuccess(result) || isFailure(result)) && reset();
  }, [result]);

  useEffect(() => {
    if (isNoteOpen && !doesNoteExist) {
      useCloseDeletedNote(noteId);
    }
  }, [isNoteOpen, doesNoteExist]);

  return (
    <NotebookToolbarButton
      loading={isLoading(result)}
      title="delete note"
      onClick={() => {
        useCloseDeletedNote(noteId);
        deleteNote(noteId);
      }}
      kind="delete"
    />
  );
};
