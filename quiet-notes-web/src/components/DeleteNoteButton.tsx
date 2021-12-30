import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { VFC } from "react";
import { useDeleteNote } from "../notebook-service/notebook-service";
import { useCloseNote } from "../notebook/notebook-state";

interface DeleteNoteButtonProps {
  noteId: string;
  isOpen: boolean;
}

export const DeleteNoteButton: VFC<DeleteNoteButtonProps> = (props) => {
  const { mutate: deleteNote } = useDeleteNote();
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
