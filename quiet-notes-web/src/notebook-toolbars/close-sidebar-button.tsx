import { closeNoteInSidebar } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const CloseSidebarButton = () => {
  return (
    <NotebookToolbarButton
      loading={false}
      title="Close sidebar"
      onClick={() => closeNoteInSidebar()}
      kind="close"
    />
  );
};
