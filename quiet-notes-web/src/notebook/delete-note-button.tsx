import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { VFC } from "react";
import { deleteNote, useCloseNote } from "../notebook/notebook-state";

interface DeleteNoteButtonProps {
  noteId: string;
  isOpen: boolean;
}

export const DeleteNoteButton: VFC<DeleteNoteButtonProps> = (props) => {
  const closeNote = useCloseNote();
  return (
    <Tooltip title="delete note">
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          props.isOpen && closeNote();
          deleteNote(props.noteId);
        }}
      >
        <DeleteIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
};
