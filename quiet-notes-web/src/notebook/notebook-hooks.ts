import firebase from "firebase/app";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { ReadNote } from "./notebook-model";

export const noteCollectionRef = firebase.firestore().collection("notes");

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
