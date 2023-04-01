import { useSelectedNoteId } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const OpenInSidebarButton = ({ noteId }: { noteId: string }) => {
  return (
    <NotebookToolbarButton
      loading={false}
      title="Open note in sidebar"
      onClick={() => console.log("open in sidebar:", noteId)}
      kind="split"
    />
  );
};
