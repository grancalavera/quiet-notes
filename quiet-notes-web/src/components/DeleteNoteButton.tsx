import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { VFC } from "react";
import { useDeleteNote } from "../notebook-service/notebook-service";
import { useDeselectNote } from "../notebook/notebook-state";

interface DeleteNoteButtonProps {
  noteId: string;
  isSelected: boolean;
}

export const DeleteNoteButton: VFC<DeleteNoteButtonProps> = (props) => {
  const { mutate: deleteNote } = useDeleteNote();
  const deselectNote = useDeselectNote();

  return (
    <Tooltip title="delete note">
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          props.isSelected && deselectNote();
          deleteNote(props.noteId);
        }}
      >
        <DeleteIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
};
