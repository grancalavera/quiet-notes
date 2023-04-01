import {
  openAdditionalNote,
  useAdditionalNoteId,
} from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const OpenAdditionalNoteButton = ({ noteId }: { noteId: string }) => {
  const additionalNoteId = useAdditionalNoteId();
  return (
    <NotebookToolbarButton
      disabled={additionalNoteId === noteId}
      loading={false}
      title="Send to additional editor"
      onClick={() => openAdditionalNote(noteId)}
      kind="split"
    />
  );
};
