import { closeAdditionalNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const CloseAdditionalNoteButton = () => {
  return (
    <NotebookToolbarButton
      loading={false}
      title="Close additional note"
      onClick={() => closeAdditionalNote()}
      kind="close"
    />
  );
};
