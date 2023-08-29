import Box from "@mui/material/Box";
import { withSubscribe } from "../lib/with-subscribe";
import { NotesListItem } from "./notebook-notes-list-item";
import { useNotesCollection } from "./notes-collection-state";

export const NotesList = withSubscribe(() => {
  const notes = useNotesCollection();
  return (
    <Box
      data-testid="notes-list"
      sx={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "0.5rem",
      }}
    >
      {notes.map((note) => (
        <NotesListItem note={note} key={note.id} />
      ))}
    </Box>
  );
});
