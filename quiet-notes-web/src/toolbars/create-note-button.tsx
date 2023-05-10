import { useEffect } from "react";
import { unknownToQNError } from "../app/app-error";
import { handleError } from "../app/app-error-state";
import { isFailure, isLoading, isSuccess } from "../lib/async-result";
import { openMainNote, useCreateNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const CreateNoteButton = () => {
  const { mutate: createNote, reset, result } = useCreateNote();

  useEffect(() => {
    isSuccess(result) && openMainNote(result.value);
    isFailure(result) && handleError(unknownToQNError(result.error));
    (isSuccess(result) || isFailure(result)) && reset();
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
