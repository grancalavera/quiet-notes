import { useEffect } from "react";
import { useErrorHandler } from "../app/app-error-state";
import { isLoadFailure, isLoading, isLoadSuccess } from "../lib/load-result";
import { useDeleteNote, useSelectedNoteId } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const DeleteNoteButton = () => {
  const { mutate: deleteNote, result, reset } = useDeleteNote();
  const handleError = useErrorHandler();
  const noteId = useSelectedNoteId();

  useEffect(() => {
    isLoadFailure(result) && handleError(result.error);
    (isLoadSuccess(result) || isLoadFailure(result)) && reset();
  }, [result]);

  return noteId ? (
    <NotebookToolbarButton
      loading={isLoading(result)}
      title="delete note"
      onClick={() => deleteNote(noteId)}
      kind="delete"
    />
  ) : null;
};
