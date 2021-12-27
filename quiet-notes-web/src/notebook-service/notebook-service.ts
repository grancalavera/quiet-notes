import { deleteDoc, Firestore, setDoc } from "firebase/firestore";
import { useErrorHandler } from "../app/app-state";
import {
  FirebaseErrorHandlerOptions,
  useFirebaseErrorHandler,
} from "../firebase/firebase-error-handler";
import { useFirestore } from "../firebase/firebase-initialize";
import { useFirebaseMutation } from "../firebase/firebase-mutation";
import { Note } from "../notebook/notebook-model";
import {
  getNoteDocRef,
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

export const useCreateNote = () => {
  const db = useFirestore();
  return useFirebaseMutation(createNote(db), { onError: useErrorHandler() });
};

export const useDeleteNote = () => {
  const db = useFirestore();
  return useFirebaseMutation(deleteNote(db), { onError: useErrorHandler() });
};

export const useUpdateNote = () => {
  const db = useFirestore();
  return useFirebaseMutation(updateNote(db), { onError: useErrorHandler() });
};

const createNote =
  (db: Firestore) =>
  async (author: string): Promise<string> => {
    const { id, ...data } = authorToWriteModel(author);
    await setDoc(getNoteDocRef(db, id), data);
    return id;
  };

const updateNote =
  (db: Firestore) =>
  (note: Note): Promise<void> => {
    const { id, ...data } = noteToWriteModel(note);
    return setDoc(getNoteDocRef(db, id), data, { merge: true });
  };

const deleteNote =
  (db: Firestore) =>
  (id: string): Promise<void> =>
    deleteDoc(getNoteDocRef(db, id));
