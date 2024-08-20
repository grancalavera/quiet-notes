import { useEffect } from "react";
import { handleUnknownError } from "../app/app-error-state";
import { isFailure, isLoading, isSuccess } from "../lib/async-result";
import { useOpenNote, useCreateNote } from "../notebook/notebook-state-v2";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const CreateNoteButton = () => {
  const { mutate: createNote, reset, result } = useCreateNote();

  useEffect(() => {
    isSuccess(result) && useOpenNote(result.value);
    isFailure(result) && handleUnknownError(result.error);
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
