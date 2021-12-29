import { FirebaseApp } from "firebase/app";
import { doc, DocumentReference, getFirestore } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { FirebaseHookResult } from "../firebase/firebase-hook-result";
import { useFirebase } from "../firebase/firebase-initialize";

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

export const getNoteDocRef = (app: FirebaseApp, id: string) =>
  doc(getFirestore(app), "notes", id);
