import Box from "@mui/material/Box";
import { Subscribe } from "@react-rxjs/core";
import { VFC } from "react";
import { LoadingLayout } from "../layout/loading-layout";
import { NotesListItem } from "./notebook-notes-list-item";
import {
  useNotesCollection,
  useSelectedNoteId,
  useSelectNoteById,
} from "./notebook-state";

export const testId = "notes-list";

export const NotesList = () => {
  return (
    <Box
      sx={{ height: "100%", overflowY: "auto", overflowX: "hidden", padding: "0.5rem" }}
      data-testid={testId}
    >
      <Subscribe fallback={<LoadingLayout />}>
        <NotesListInternal />
      </Subscribe>
    </Box>
  );
};

const NotesListInternal: VFC = () => {
  const selectedNoteId = useSelectedNoteId();
  const selectNoteById = useSelectNoteById();
  const notes = useNotesCollection();
  return (
    <>
      {notes.map((note) => (
        <NotesListItem
          note={note}
          key={note.id}
          isSelected={note.id === selectedNoteId}
          onSelect={() => selectNoteById(note.id)}
        />
      ))}
    </>
  );
};
