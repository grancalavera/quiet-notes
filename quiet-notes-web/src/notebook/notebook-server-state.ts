import firebase from "firebase";
import {
  useCollectionData,
  useDocumentData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
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

export const useNoteOnce = (id: string) =>
  useDocumentDataOnce<ReadNote>(noteCollectionRef.doc(id), {
    idField: "id",
  });

export const upsertNote = ({ id, ...note }: WriteNoteStub | WriteNoteUpdate) =>
  noteCollectionRef.doc(id).set(note);

export const deleteNote = (id: string) => noteCollectionRef.doc(id).delete();
