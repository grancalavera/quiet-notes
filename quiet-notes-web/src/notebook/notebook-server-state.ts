import firebase from "firebase";
import { useCallback, useState } from "react";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { useUserInfo } from "../firebase/firebase";
import { useNotebookState } from "./notebook-local-state";
import { noteStub, ReadNote } from "./notebook-model";

const noteCollectionRef = firebase.firestore().collection("notes");

export const useNotesCollection = (userInfo: firebase.UserInfo | null | undefined) => {
  const query = noteCollectionRef
    .where("author.uid", "==", userInfo?.uid ?? "")
    .orderBy("modifiedAt", "desc");

  return useCollectionData<ReadNote>(query, { idField: "id" });
};

export const useNote = (id: string) =>
  useDocumentData<ReadNote>(noteCollectionRef.doc(id), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

export const useCreateNote = () => {
  const author = useUserInfo();
  const selectNote = useNotebookState((s) => s.selectNote);
  const [isLoading, setIsLoading] = useState(false);

  const createNote = useCallback(() => {
    setIsLoading(true);

    const { id, ...note } = noteStub(author!);
    console.log(id, note);

    (async () => {
      await noteCollectionRef.doc(id).set(note);
      selectNote(id);
      setIsLoading(false);
    })();
  }, [author, selectNote]);

  return [createNote, isLoading] as const;
};
