import { useEffect } from "react";
import { handleUnknownError } from "../app/app-error-state";
import { isFailure, isLoading, isSuccess } from "../lib/async-result";
import { useNote } from "../note/note-state";
import { deriveTitle } from "../notebook/notebook-model";
import { openNote, useCreateNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const DuplicateNoteButton = ({ noteId }: { noteId: string }) => {
  const { mutate: createNote, reset, result } = useCreateNote();
  const note = useNote(noteId);

  useEffect(() => {
    isFailure(result) && handleUnknownError(result.error);
    (isSuccess(result) || isFailure(result)) && reset();
    isSuccess(result) && openNote(result.value);
  }, [result]);

  return (
    <NotebookToolbarButton
      loading={isLoading(result)}
      title="duplicate note"
      onClick={() => {
        const title = note ? deriveTitle(note) : "untitled note";
        const content = `copy of ${title}\n${note?.content ?? ""}`;
        return createNote(content);
      }}
      kind="duplicate"
    />
  );
};
