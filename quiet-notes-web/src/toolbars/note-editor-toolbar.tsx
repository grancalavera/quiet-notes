import ButtonGroup from "@mui/material/ButtonGroup";
import { CloseAdditionalNoteButton } from "./close-additional-note-button";
import { NotebookToolbarLayout } from "./notebook-toolbar-layout";
import { OpenAdditionalNoteButton } from "./open-in-sidebar-button";

export const MainNoteEditorToolbar = ({ noteId }: { noteId: string }) => {
  return (
    <NotebookToolbarLayout>
      <ButtonGroup>
        <OpenAdditionalNoteButton noteId={noteId} />
      </ButtonGroup>
    </NotebookToolbarLayout>
  );
};

export const AdditionalNoteEditorToolbar = () => {
  return (
    <NotebookToolbarLayout>
      <ButtonGroup>
        <CloseAdditionalNoteButton />
      </ButtonGroup>
    </NotebookToolbarLayout>
  );
};
