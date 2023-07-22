import Typography from "@mui/material/Typography";
import { openAdditionalNote, openMainNote } from "../notebook/notebook-state";
import { CloseAdditionalNoteButton } from "./close-additional-note-button";
import { DuplicateNoteButton } from "./duplicate-note-button";
import { NotebookToolbarLayout } from "./notebook-toolbar-layout";
import { OpenAdditionalNoteButton } from "./open-additional-note-button";
import { withSubscribe } from "../lib/with-subscribe";
import { useNoteTitle } from "../note/note-state";

type WithNoteId = { noteId: string };

export const MainNoteEditorToolbar = ({ noteId }: WithNoteId) => {
  return (
    <NotebookToolbarLayout title={<NoteTitle noteId={noteId} />}>
      <DuplicateNoteButton noteId={noteId} onDuplicated={openMainNote} />
      <OpenAdditionalNoteButton noteId={noteId} />
    </NotebookToolbarLayout>
  );
};

export const AdditionalNoteEditorToolbar = ({ noteId }: { noteId: string }) => {
  return (
    <NotebookToolbarLayout title={<NoteTitle noteId={noteId} />}>
      <DuplicateNoteButton noteId={noteId} onDuplicated={openAdditionalNote} />
      <CloseAdditionalNoteButton />
    </NotebookToolbarLayout>
  );
};

const NoteTitle = withSubscribe(({ noteId }: WithNoteId) => {
  const title = useNoteTitle(noteId);
  return (
    <Typography
      variant="h6"
      sx={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      }}
    >
      {title}
    </Typography>
  );
});
