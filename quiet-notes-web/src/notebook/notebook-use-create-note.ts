import firebase from "firebase";
import { useCallback, useState } from "react";
import { useUserInfo } from "../firebase/firebase";
import { noteCollectionRef } from "./notebook-hooks";
import { createNoteDraft } from "./notebook-model";
import { useNotebookState } from "./notebook-state";
import "./notebook-toolbars.scss";

export const useCreateNote = () => {
  const author = useUserInfo();
  const selectNote = useNotebookState((s) => s.selectNote);
  const [isLoading, setIsLoading] = useState(false);

  const createNote = useCallback(() => {
    setIsLoading(true);
    (async () => {
      const result = await noteCollectionRef.add({
        ...createNoteDraft(author!),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      selectNote(result.id);
      setIsLoading(false);
    })();
  }, [author, selectNote]);

  return [createNote, isLoading] as const;
};
