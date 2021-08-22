import firebase from "firebase";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { useFirebaseErrorHandler } from "../firebase/firebase-error-handler";

export const notesCollection = () => firebase.firestore().collection("notes");

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
) => {
  const query = notesCollection()
    .where("author", "==", author)
    .orderBy("_updatedAt", "desc");
  const result = useCollectionData<TData, IdField>(query, options);
  return useFirebaseErrorHandler(result);
};

export const useNoteInternal = <
  IdField extends string,
  TDocument = unknown,
  TData = TDocument
>(
  id: string,
  options: NotebookServiceOptions<TDocument, TData, IdField>
) => {
  const query = notesCollection().doc(id);
  const result = useDocumentData<TData, IdField>(query, options);
  return useFirebaseErrorHandler(result);
};
