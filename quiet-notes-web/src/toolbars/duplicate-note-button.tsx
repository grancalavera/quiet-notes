import { useEffect } from "react";
import { handleError } from "../app/app-error-state";
import { isLoadFailure, isLoading, isLoadSuccess } from "../lib/load-result";
import { useNote } from "../note/note-state";
import { openMainNote, useCreateNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const DuplicateNoteButton = ({
  noteId,
  onDuplicated,
}: {
  onDuplicated: (noteId: string) => void;
  noteId: string;
}) => {
  const { mutate: createNote, reset, result } = useCreateNote();
  const note = useNote(noteId);

  useEffect(() => {
    isLoadFailure(result) && handleError(result.error);
    (isLoadSuccess(result) || isLoadFailure(result)) && reset();
    isLoadSuccess(result) && onDuplicated(result.value);
  }, [result]);

  return (
    <NotebookToolbarButton
      loading={isLoading(result)}
      title="duplicate note"
      onClick={() => createNote(`copy of ${noteId}\n${note?.content ?? ""}`)}
      kind="duplicate"
    />
  );
};
