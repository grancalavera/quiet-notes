import { useEffect } from "react";
import { handleUnknownError } from "../app/app-error-state";
import { isFailure, isLoading, isSuccess } from "../lib/async-result";
import { closeDeletedNote, useDeleteNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const DeleteNoteButton = ({ noteId }: { noteId: string }) => {
  const { mutate: deleteNote, result, reset } = useDeleteNote();

  useEffect(() => {
    isFailure(result) && handleUnknownError(result.error);
    (isSuccess(result) || isFailure(result)) && reset();
  }, [result]);

  return (
    <NotebookToolbarButton
      loading={isLoading(result)}
      title="delete note"
      onClick={() => {
        closeDeletedNote(noteId);
        deleteNote(noteId);
      }}
      kind="delete"
    />
  );
};
