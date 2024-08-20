import {
  useOpenAdditionalNote,
  useAdditionalNoteId,
  useMainNoteId,
} from "../notebook/notebook-state-v2";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const OpenAdditionalNoteButton = ({ noteId }: { noteId: string }) => {
  const mainNoteId = useMainNoteId();
  const additionalNoteId = useAdditionalNoteId();
  return (
    <NotebookToolbarButton
      disabled={additionalNoteId === noteId || mainNoteId === undefined}
      loading={false}
      title="Send to additional editor"
      onClick={() => useOpenAdditionalNote(noteId)}
      kind="split"
    />
  );
};
