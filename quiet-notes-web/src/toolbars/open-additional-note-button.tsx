import {
  openAdditionalNote,
  useNotebookState,
} from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const OpenAdditionalNoteButton = ({ noteId }: { noteId: string }) => {
  const { additionalNoteId, mainNoteId } = useNotebookState();
  return (
    <NotebookToolbarButton
      disabled={additionalNoteId === noteId || mainNoteId === undefined}
      loading={false}
      title="Send to additional editor"
      onClick={() => openAdditionalNote(noteId)}
      kind="split"
    />
  );
};
