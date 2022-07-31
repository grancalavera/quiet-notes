import ButtonGroup from "@mui/material/ButtonGroup";
import { CreateNoteButton } from "./create-note-button";
import { DeleteNoteButton } from "./delete-note-button";
import { NotebookToolbarLayout } from "./notebook-toolbar-layout";
import { UpdateMonitor } from "./update-monitor";

export const NotebookEditorToolbar = () => {
  return (
    <NotebookToolbarLayout>
      <UpdateMonitor />
      <ButtonGroup>
        <DeleteNoteButton />
        <CreateNoteButton />
      </ButtonGroup>
    </NotebookToolbarLayout>
  );
};
