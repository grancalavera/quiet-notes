import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect, VFC } from "react";
import { useErrorHandler } from "../app/app-state";
import { isLoadFailure, isLoadSuccess } from "../lib/load-result";
import { useDeleteNote, useSelectedNoteId } from "../notebook/notebook-state";

export const DeleteNoteButton: VFC = () => {
  const noteId = useSelectedNoteId();
  const { mutate: deleteNote, result, reset } = useDeleteNote();
  const handleError = useErrorHandler();

  useEffect(() => {
    isLoadFailure(result) && handleError(result.error);
    (isLoadSuccess(result) || isLoadFailure(result)) && reset();
  }, [result]);

  return noteId ? (
    <Tooltip title="delete note">
      <IconButton onClick={() => deleteNote(noteId)}>
        <DeleteIcon color="primary" />
      </IconButton>
    </Tooltip>
  ) : null;
};
