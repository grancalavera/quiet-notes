import { useEffect, VFC } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorHandler } from "../app/app-error-state";
import { isLoadFailure, isLoading, isLoadSuccess } from "../lib/load-result";
import { useCreateNote } from "../notebook/notebook-state";
import { NotebookToolbarButton } from "./notebook-toolbar-button";

export const CreateNoteButton: VFC = () => {
  const { mutate: createNote, reset, result } = useCreateNote();
  const handleError = useErrorHandler();
  const navigate = useNavigate();

  useEffect(() => {
    isLoadSuccess(result) && navigate(`/notebook/${result.value}`);
    isLoadFailure(result) && handleError(result.error);
    (isLoadSuccess(result) || isLoadFailure(result)) && reset();
  }, [result]);

  return (
    <NotebookToolbarButton
      loading={isLoading(result)}
      title="create note"
      onClick={() => createNote()}
      kind="create"
    />
  );
};
