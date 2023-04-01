import { CreateNoteButton } from "./create-note-button";
import { NotebookSortMenu } from "./notebook-sort-menu";
import { NotebookToolbarLayout } from "./notebook-toolbar-layout";

export const NotebookSidebarToolbar = () => (
  <NotebookToolbarLayout>
    <CreateNoteButton />
    <NotebookSortMenu />
  </NotebookToolbarLayout>
);
