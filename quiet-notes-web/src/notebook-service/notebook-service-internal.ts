import firebase from "firebase";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { useErrorHandler } from "../app/app-state";
import { useFirebaseErrorHandler } from "../firebase/firebase-error-handler";
import { useFirebaseMutation } from "../firebase/firebase-mutation";
import { Note } from "../notebook/notebook-model";
import { authorToWriteModel, noteToWriteModel } from "./notebook-service-model";

const notesCollection = () => firebase.firestore().collection("notes");

interface NotebookServiceOptions<
  IdField extends string,
  TDocument = unknown,
  TData = TDocument
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
  options: NotebookServiceOptions<IdField, TDocument, TData>
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
  options: NotebookServiceOptions<IdField, TDocument, TData>
) => {
  const query = notesCollection().doc(id);
  const result = useDocumentData<TData, IdField>(query, options);
  return useFirebaseErrorHandler(result);
};

export const useCreateNote = () =>
  useFirebaseMutation(createNote, { onError: useErrorHandler() });

export const useDeleteNote = () =>
  useFirebaseMutation(deleteNote, { onError: useErrorHandler() });

export const useUpdateNote = () =>
  useFirebaseMutation(updateNote, { onError: useErrorHandler() });

const createNote = async (author: string): Promise<string> => {
  const { id, ...data } = authorToWriteModel(author);
  await notesCollection().doc(id).set(data);
  return id;
};

const updateNote = (note: Note): Promise<void> => {
  const { id, ...data } = noteToWriteModel(note);
  return notesCollection().doc(id).set(data, { merge: true });
};

const deleteNote = (id: string): Promise<void> => notesCollection().doc(id).delete();
