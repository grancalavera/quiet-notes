import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useDeleteNote } from "../notebook-service/notebook-service";
import { useDeselectNote, useSelectedNoteId } from "../notebook/notebook-state";

export function DeleteNoteButton(props: { noteId: string }) {
  const { mutate: deleteNote } = useDeleteNote();
  const deselectNote = useDeselectNote();
  const selectedNoteId = useSelectedNoteId();

  return (
    <Tooltip title="delete note">
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          deleteNote(props.noteId);
          props.noteId === selectedNoteId && deselectNote();
        }}
      >
        <DeleteIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
}
