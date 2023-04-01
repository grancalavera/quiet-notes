import Box from "@mui/material/Box";
import { Subscribe } from "@react-rxjs/core";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/loading";
import { NotesListItem } from "./notebook-notes-list-item";
import { notebookState$, useNotesCollection } from "./notebook-state";

export const NotesList = () => {
  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "0.5rem",
      }}
    >
      <Subscribe fallback={<Loading />}>
        <NotesListInternal />
      </Subscribe>
    </Box>
  );
};

const NotesListInternal = () => {
  const notes = useNotesCollection();
  const navigate = useNavigate();

  return (
    <Subscribe source$={notebookState$}>
      {notes.map((note) => (
        <NotesListItem note={note} key={note.id} />
      ))}
    </Subscribe>
  );
};
