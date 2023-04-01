import ButtonGroup from "@mui/material/ButtonGroup";
import { openAdditionalNote, openMainNote } from "../notebook/notebook-state";
import { CloseAdditionalNoteButton } from "./close-additional-note-button";
import { DuplicateNoteButton } from "./duplicate-note-button";
import { NotebookToolbarLayout } from "./notebook-toolbar-layout";
import { OpenAdditionalNoteButton } from "./open-in-sidebar-button";

export const MainNoteEditorToolbar = ({ noteId }: { noteId: string }) => {
  return (
    <NotebookToolbarLayout>
      {noteId}
      <ButtonGroup>
        <DuplicateNoteButton
          noteId={noteId}
          onDuplicated={(dupId) => openMainNote(dupId)}
        />
        <OpenAdditionalNoteButton noteId={noteId} />
      </ButtonGroup>
    </NotebookToolbarLayout>
  );
};

export const AdditionalNoteEditorToolbar = ({ noteId }: { noteId: string }) => {
  return (
    <NotebookToolbarLayout>
      {noteId}
      <ButtonGroup>
        <DuplicateNoteButton
          noteId={noteId}
          onDuplicated={(dupId) => openAdditionalNote(dupId)}
        />
        <CloseAdditionalNoteButton />
      </ButtonGroup>
    </NotebookToolbarLayout>
  );
};
