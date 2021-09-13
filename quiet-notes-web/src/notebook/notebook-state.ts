import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";

interface NotebookState {
  noteId?: string;
}

export const useSelectedNoteId = () => useParams<NotebookState>().noteId;

export const useSelectNote = () => {
  const history = useHistory();

  return useCallback(
    (noteId: string) => {
      history.push(`/notebook/${noteId}`);
    },
    [history]
  );
};

export const useDeselectNote = () => {
  const history = useHistory();

  return useCallback(() => {
    history.push("/notebook");
  }, [history]);
};
