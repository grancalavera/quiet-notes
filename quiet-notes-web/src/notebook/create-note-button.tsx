import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, VFC } from "react";
import { useErrorHandler } from "../app/app-error-state";
import { isLoadFailure, isLoadSuccess } from "../lib/load-result";
import { selectNote, useCreateNote } from "./notebook-state";

export const CreateNoteButton: VFC<{ showLabel?: boolean }> = (props) => {
  const label = "create note";
  const { mutate: createNote, reset, result } = useCreateNote();
  const handleError = useErrorHandler();

  useEffect(() => {
    isLoadSuccess(result) && selectNote(result.value);
    isLoadFailure(result) && handleError(result.error);
    (isLoadSuccess(result) || isLoadFailure(result)) && reset();
  }, [result]);

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
