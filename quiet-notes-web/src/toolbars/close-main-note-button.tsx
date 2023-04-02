import { closeMainNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const CloseMainNoteButton = () => {
  return (
    <NotebookToolbarButton
      loading={false}
      title="Close main note"
      onClick={() => closeMainNote()}
      kind="close"
    />
  );
};
