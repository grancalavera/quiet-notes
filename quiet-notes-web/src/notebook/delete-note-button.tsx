import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { VFC } from "react";
import { withSubscribe } from "../lib/with-subscribe";
import { closeNote, deleteNote, deleteNoteResult$ } from "../notebook/notebook-state";

interface DeleteNoteButtonProps {
  noteId?: string;
  isOpen: boolean;
}

const DeleteNoteButton_Unsubscribed: VFC<DeleteNoteButtonProps> = ({ noteId, isOpen }) =>
  noteId ? (
    <Tooltip title="delete note">
      <IconButton
        onClick={() => {
          deleteNote(noteId);
          isOpen && closeNote();
        }}
      >
        <DeleteIcon color="primary" />
      </IconButton>
    </Tooltip>
  ) : null;

export const DeleteNoteButton = withSubscribe(DeleteNoteButton_Unsubscribed, {
  source$: deleteNoteResult$,
});
