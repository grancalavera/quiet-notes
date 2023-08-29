import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const CloseNoteButton = ({ onClose }: { onClose: () => void }) => {
  return (
    <NotebookToolbarButton
      loading={false}
      title="Close note button"
      onClick={() => onClose()}
      kind="close"
    />
  );
};
