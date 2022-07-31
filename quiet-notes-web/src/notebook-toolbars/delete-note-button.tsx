import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect } from "react";
import { useErrorHandler } from "../app/app-error-state";
import { isLoadFailure, isLoading, isLoadSuccess } from "../lib/load-result";
import { withNoteId } from "../lib/with-note-id";
import { useDeleteNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const DeleteNoteButton = withNoteId(({ noteId }) => {
  const { mutate: deleteNote, result, reset } = useDeleteNote();
  const handleError = useErrorHandler();

  useEffect(() => {
    isLoadFailure(result) && handleError(result.error);
    (isLoadSuccess(result) || isLoadFailure(result)) && reset();
  }, [result]);

  return (
    <NotebookToolbarButton
      loading={isLoading(result)}
      title="delete note"
      onClick={() => deleteNote(noteId)}
      kind="delete"
    />
  );
});
