import ButtonGroup from "@mui/material/ButtonGroup";
import { CloseSidebarButton } from "./close-sidebar-button";
import { CreateNoteButton } from "./create-note-button";
import { DeleteNoteButton } from "./delete-note-button";
import { NotebookToolbarLayout } from "./notebook-toolbar-layout";

export const NotebookEditorToolbar = () => {
  return (
    <NotebookToolbarLayout>
      <ButtonGroup>
        <DeleteNoteButton />
        <CreateNoteButton />
        <CloseSidebarButton />
      </ButtonGroup>
    </NotebookToolbarLayout>
  );
};
