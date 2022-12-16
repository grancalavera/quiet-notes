import Box from "@mui/material/Box";
import { Subscribe } from "@react-rxjs/core";
import { VFC } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/loading";
import { NotesListItem } from "./notebook-notes-list-item";
import { useNotesCollection, useSelectedNoteId } from "./notebook-state";

export const testId = "notes-list";

export const NotesList = () => {
  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "0.5rem",
      }}
      data-testid={testId}
    >
      <Subscribe fallback={<Loading />}>
        <NotesListInternal />
      </Subscribe>
    </Box>
  );
};

const NotesListInternal: VFC = () => {
  const selectedNoteId = useSelectedNoteId();
  const notes = useNotesCollection();
  const navigate = useNavigate();

  return (
    <>
      {notes.map((note) => (
        <NotesListItem
          note={note}
          key={note.id}
          isSelected={note.id === selectedNoteId}
          onSelect={() => navigate(`/notebook/${note.id}`)}
        />
      ))}
    </>
  );
};
