import { useEffect } from "react";
import { unknownToQNError } from "../app/app-error";
import { handleError } from "../app/app-error-state";
import { isFailure, isLoading, isSuccess } from "../lib/async-result";
import { useNote } from "../note/note-state";
import { useCreateNote } from "../notebook/notebook-state";
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
    isFailure(result) && handleError(unknownToQNError(result.error));
    (isSuccess(result) || isFailure(result)) && reset();
    isSuccess(result) && onDuplicated(result.value);
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
