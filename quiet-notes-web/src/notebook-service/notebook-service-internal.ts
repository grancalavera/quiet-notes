import { FirebaseApp } from "firebase/app";
import {
  collection,
  doc,
  DocumentReference,
  Firestore,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { useFirebase, useFirestore } from "../firebase/firebase-initialize";
import { FirebaseHookResult } from "../firebase/firebase-hook-result";

interface NotebookServiceOptions<
  TDocument = unknown,
  TData = TDocument,
  IdField extends string = ""
> {
  transform: (document: TDocument) => TData;
  idField: IdField;
}

export const useNotesCollectionInternal = <
  IdField extends string,
  TDocument = unknown,
  TData = TDocument
>(
  author: string,
  options: NotebookServiceOptions<TDocument, TData, IdField>
): FirebaseHookResult<TData[] | undefined> => {
  const q = query(collection(useFirestore(), "notes"), where("author", "==", author));
  return useCollectionData(q, options) as FirebaseHookResult<TData[] | undefined>;
};

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

export const getNoteDocRef = (app: FirebaseApp, id: string) =>
  doc(getFirestore(app), "notes", id);
