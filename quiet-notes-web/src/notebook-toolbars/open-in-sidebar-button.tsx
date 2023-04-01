import { openNoteInSidebar } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const OpenInSidebarButton = ({ noteId }: { noteId: string }) => {
  return (
    <NotebookToolbarButton
      loading={false}
      title="Open note in sidebar"
      onClick={() => openNoteInSidebar(noteId)}
      kind="split"
    />
  );
};
