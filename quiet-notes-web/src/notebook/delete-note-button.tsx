import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect, VFC } from "react";
import { isLoading, isLoadSuccess } from "../lib/load-result";
import { withSubscribe } from "../lib/with-subscribe";
import {
  deleteNote,
  useCloseNote,
  useDeleteNoteResult,
} from "../notebook/notebook-state";

interface DeleteNoteButtonProps {
  noteId: string;
  isOpen: boolean;
}

const DeleteNoteButton_Unsubscribed: VFC<DeleteNoteButtonProps> = (props) => {
  const closeNote = useCloseNote();
  const result = useDeleteNoteResult();

  useEffect(() => {
    isLoadSuccess(result) && props.isOpen && closeNote();
  }, [result, props.isOpen]);

  return (
    <Tooltip title="delete note">
      <IconButton onClick={() => deleteNote(props.noteId)} disabled={isLoading(result)}>
        <DeleteIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
};

export const DeleteNoteButton = withSubscribe(DeleteNoteButton_Unsubscribed);
