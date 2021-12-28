import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, VFC } from "react";
import { useUser } from "../auth/user";
import { useCreateNote } from "../notebook-service/notebook-service";
import { useSelectNote } from "../notebook/notebook-state";

export const CreateNoteButton: VFC<{ showLabel?: boolean }> = (props) => {
  const user = useUser();
  const { mutate: createNote, data } = useCreateNote();
  const selectNote = useSelectNote();
  const label = "create note";

  useEffect(() => {
    data && selectNote(data);
  }, [data, selectNote]);
  return (
    <Tooltip title={label}>
      {props.showLabel ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => createNote(user.uid)}
          startIcon={<NoteAddIcon />}
        >
          {label}
        </Button>
      ) : (
        <IconButton onClick={() => createNote(user.uid)} color="primary">
          <NoteAddIcon />
        </IconButton>
      )}
    </Tooltip>
  );
};
