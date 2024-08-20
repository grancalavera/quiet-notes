import { useCloseAdditionalNote } from "../notebook/notebook-state-v2";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const CloseAdditionalNoteButton = () => {
  return (
    <NotebookToolbarButton
      loading={false}
      title="Close additional note"
      onClick={() => useCloseAdditionalNote()}
      kind="close"
    />
  );
};
