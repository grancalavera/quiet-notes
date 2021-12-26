import { CircularProgress } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { useUser } from "../app/app-state";
import { CreateNoteButton } from "../components/CreateNoteButton";
import { CenterLayout } from "../layout/center-layout";
import { useNotesCollection } from "../notebook-service/notebook-service";
import { NotesListItem } from "./notebook-notes-list-item";
import { useNotes, useSelectedNoteId, useSelectNote, loadNotes } from "./notebook-state";
import Box from "@mui/material/Box";

export const testId = "notes-list";

export const NotesList = () => {
  const user = useUser();
  const [notes, isLoading] = useNotesCollection(user.uid);
  const selectedNoteId = useSelectedNoteId();
  const selectNote = useSelectNote();

  const notebookNotes = useNotes();

  useEffect(() => {
    notes && loadNotes(notes);
  }, [notes, loadNotes]);

  let children: ReactNode;

  if (isLoading) {
    children = (
      <CenterLayout>
        <CircularProgress />
      </CenterLayout>
    );
  } else if (notes && notes.length > 0) {
    children = (
      <>
        {notebookNotes.map((note) => (
          <NotesListItem
            note={note}
            key={note.id}
            isSelected={note.id === selectedNoteId}
            onSelect={() => selectNote(note.id)}
          />
        ))}
      </>
    );
  } else {
    children = (
      <CenterLayout>
        <CreateNoteButton showLabel />
      </CenterLayout>
    );
  }

  return (
    <Box
      sx={{ height: "100%", overflowY: "auto", overflowX: "hidden", padding: "0.5rem" }}
      data-testid={testId}
    >
      {children}
    </Box>
  );
};
