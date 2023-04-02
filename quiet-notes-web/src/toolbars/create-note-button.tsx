import { useEffect } from "react";
import { handleError } from "../app/app-error-state";
import { isLoadFailure, isLoading, isLoadSuccess } from "../lib/load-result";
import { openMainNote, useCreateNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const CreateNoteButton = () => {
  const { mutate: createNote, reset, result } = useCreateNote();

  useEffect(() => {
    isLoadSuccess(result) && openMainNote(result.value);
    isLoadFailure(result) && handleError(result.error);
    (isLoadSuccess(result) || isLoadFailure(result)) && reset();
  }, [result]);

  return (
    <NotebookToolbarButton
      loading={isLoading(result)}
      title="create note"
      onClick={() => createNote("")}
      kind="create"
    />
  );
};
