import Box from "@mui/material/Box";
import { ReactNode, useEffect } from "react";
import { useUser } from "../auth/user-streams";
import { CreateNoteButton } from "../components/CreateNoteButton";
import { CenterLayout } from "../layout/center-layout";
import { LoadingLayout } from "../layout/loading-layout";
import { useNotesCollection } from "../notebook-service/notebook-service";
import { useTheNotesCollection } from "../notebook-service/notebook-streams";
import { NotesListItem } from "./notebook-notes-list-item";
import { loadNotes, useNotes, useSelectedNoteId, useSelectNote } from "./notebook-state";

export const testId = "notes-list";

export const NotesList = () => {
  const user = useUser();
  const [notes, isLoading] = useNotesCollection(user.uid);
  const selectedNoteId = useSelectedNoteId();
  const selectNote = useSelectNote();
  const notebookNotes = useNotes();

  const result = useTheNotesCollection();

  useEffect(() => {
    console.log({ result });
  }, [result]);

  useEffect(() => {
    notes && loadNotes(notes);
  }, [notes, loadNotes]);

  let children: ReactNode;

  if (isLoading) {
    children = <LoadingLayout />;
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
