import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";

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
  const query = notesCollection().where("author", "==", author);
  return useCollectionData<TData, IdField>(query, options);
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
  return useDocumentData<TData, IdField>(query, options);
};
