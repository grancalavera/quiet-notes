import { useEffect } from "react";
import { handleError } from "../app/app-error-state";
import { isLoadFailure, isLoading, isLoadSuccess } from "../lib/load-result";
import { closeDeletedNote, useDeleteNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const DeleteNoteButton = ({ noteId }: { noteId: string }) => {
  const { mutate: deleteNote, result, reset } = useDeleteNote();

  useEffect(() => {
    isLoadFailure(result) && handleError(result.error);
    (isLoadSuccess(result) || isLoadFailure(result)) && reset();
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
