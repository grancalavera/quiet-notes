import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { VFC } from "react";
import { Redirect } from "react-router";
import { createNote, useCreateNoteResult } from "./notebook-state";

export const CreateNoteButton: VFC<{ showLabel?: boolean }> = (props) => {
  const label = "create note";
  const noteId = useCreateNoteResult();

  return (
    <>
      {noteId && <Redirect to={`/notebook/${noteId}`} />}
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
    </>
  );
};
