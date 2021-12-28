import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { VFC } from "react";
import { createNote } from "../notebook/notebook-state";

export const CreateNoteButton: VFC<{ showLabel?: boolean }> = (props) => {
  const label = "create note";

  return (
    <Tooltip title={label}>
      {props.showLabel ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => createNote()}
          startIcon={<NoteAddIcon />}
        >
          {label}
        </Button>
      ) : (
        <IconButton onClick={() => createNote()} color="primary">
          <NoteAddIcon />
        </IconButton>
      )}
    </Tooltip>
  );
};
