import firebase from "firebase";
import { useCallback } from "react";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { ReadNote, WriteNoteStub, WriteNoteUpdate } from "./notebook-model";

const noteCollectionRef = firebase.firestore().collection("notes");

export const useNotesCollection = (userInfo: firebase.UserInfo | null | undefined) => {
  const query = noteCollectionRef
    .where("author.uid", "==", userInfo?.uid ?? "")
    .orderBy("_updatedAt", "desc");

  return useCollectionData<ReadNote>(query, { idField: "id" });
};

export const useNote = (id: string) =>
  useDocumentData<ReadNote>(noteCollectionRef.doc(id), {
    snapshotListenOptions: { includeMetadataChanges: true },
    idField: "id",
  });

export const useUpsertNote = () => {
  const upsertNote = useCallback(({ id, ...note }: WriteNoteStub | WriteNoteUpdate) => {
    noteCollectionRef.doc(id).set(note);
  }, []);

  return upsertNote;
};
