import { collection, doc, Firestore, query, where } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { useFirestore } from "../firebase/firebase-initialize";

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
  const q = query(collection(useFirestore(), "notes"), where("author", "==", author));
  return useCollectionData<TData, IdField>(q, options);
};

export const useNoteInternal = <
  IdField extends string,
  TDocument = unknown,
  TData = TDocument
>(
  id: string,
  options: NotebookServiceOptions<TDocument, TData, IdField>
) => {
  return useDocumentData<TData, IdField>(getNoteDocRef(useFirestore(), id), options);
};

export const getNoteDocRef = (db: Firestore, id: string) => doc(db, "notes", id);
