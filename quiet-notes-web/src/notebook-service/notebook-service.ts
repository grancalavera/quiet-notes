import { useErrorHandler } from "../app/app-state";
import {
  FirebaseErrorHandlerOptions,
  useFirebaseErrorHandler,
} from "../firebase/firebase-error-handler";
import { useFirebaseMutation } from "../firebase/firebase-mutation";
import { Note } from "../notebook/notebook-model";
import {
  notesCollection,
  useNoteInternal,
  useNotesCollectionInternal,
} from "./notebook-service-internal";
import {
  authorToWriteModel,
  noteFromReadModel,
  noteToWriteModel,
} from "./notebook-service-model";

export const useNotesCollection = (
  author: string,
  options: FirebaseErrorHandlerOptions = {}
) => {
  const result = useNotesCollectionInternal(author, {
    idField: "id",
    transform: noteFromReadModel,
  });
  return useFirebaseErrorHandler(result, options);
};

export const useNote = (id: string, options: FirebaseErrorHandlerOptions = {}) => {
  const result = useNoteInternal(id, {
    idField: "id",
    transform: noteFromReadModel,
  });
  return useFirebaseErrorHandler(result, options);
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
