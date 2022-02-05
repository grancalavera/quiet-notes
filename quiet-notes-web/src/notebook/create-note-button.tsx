import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { VFC } from "react";
import { Redirect } from "react-router";
import { isLoadSuccess } from "../lib/load-result";
import { withSubscribe } from "../lib/with-subscribe";
import { createNote, useCreateNoteResult } from "./notebook-state";

const CreateNoteButton_Unsubscribed: VFC<{ showLabel?: boolean }> = (props) => {
  const label = "create note";
  const result = useCreateNoteResult();

  return (
    <>
      {isLoadSuccess(result) && <Redirect to={`/notebook/${result.value}`} />}
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

export const CreateNoteButton = withSubscribe(CreateNoteButton_Unsubscribed);
