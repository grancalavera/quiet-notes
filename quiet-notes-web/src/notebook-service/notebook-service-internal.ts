import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { collectionData } from "rxfire/firestore";
import { FirebaseHookResult } from "../firebase/firebase-hook-result";
import { useFirebase } from "../firebase/firebase-initialize";
import { Note } from "../notebook/notebook-model";
import {
  authorToWriteModel,
  noteConverter,
  noteToWriteModel,
} from "./notebook-service-model";

interface NotebookServiceOptions<
  TDocument = unknown,
  TData = TDocument,
  IdField extends string = ""
> {
  transform: (document: TDocument) => TData;
  idField: IdField;
}

export const useNoteInternal = <
  IdField extends string,
  TDocument = unknown,
  TData = TDocument
>(
  id: string,
  options: NotebookServiceOptions<TDocument, TData, IdField>
): FirebaseHookResult<TData | undefined> => {
  const docRef = getNoteDocRef(useFirebase(), id) as DocumentReference<TData>;
  return useDocumentData<TData, IdField>(docRef, options) as FirebaseHookResult<
    TData | undefined
  >;
};

const getNoteDocRef = (app: FirebaseApp, id: string) =>
  doc(getFirestore(app), "notes", id);

export const updateNoteInternal =
  (app: FirebaseApp) =>
  (note: Note): Promise<void> => {
    const { id, ...data } = noteToWriteModel(note);
    return setDoc(getNoteDocRef(app, id), data, { merge: true });
  };

export const deleteNoteInternal =
  (app: FirebaseApp) =>
  (id: string): Promise<void> =>
    deleteDoc(getNoteDocRef(app, id));

export const createNoteInternal = async (
  app: FirebaseApp,
  user: User
): Promise<string> => {
  const { id, ...data } = authorToWriteModel(user.uid);
  await setDoc(getNoteDocRef(app, id), data);
  return id;
};

export const getNotesCollectionInternal = (app: FirebaseApp, user: User) => {
  const collectionRef = collection(getFirestore(app), "notes").withConverter(
    noteConverter
  );
  const q = query(collectionRef, where("author", "==", user.uid));
  return collectionData(q, { idField: "id" });
};
