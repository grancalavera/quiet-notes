import { FirebaseApp } from "firebase/app";
import { deleteDoc, setDoc } from "firebase/firestore";
import { useErrorHandler } from "../app/app-state";
import {
  FirebaseErrorHandlerOptions,
  useFirebaseErrorHandler,
} from "../firebase/firebase-error-handler";
import { useFirebase } from "../firebase/firebase-initialize";
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

export const useDeleteNote = () => {
  const app = useFirebase();
  return useFirebaseMutation(deleteNoteInternal(app), { onError: useErrorHandler() });
};

export const useUpdateNote = () => {
  const app = useFirebase();
  return useFirebaseMutation(updateNoteInternal(app), { onError: useErrorHandler() });
};

export const createNoteInternal = async (
  app: FirebaseApp,
  author: string
): Promise<string> => {
  const { id, ...data } = authorToWriteModel(author);
  await setDoc(getNoteDocRef(app, id), data);
  return id;
};

const updateNoteInternal =
  (app: FirebaseApp) =>
  (note: Note): Promise<void> => {
    const { id, ...data } = noteToWriteModel(note);
    return setDoc(getNoteDocRef(app, id), data, { merge: true });
  };

const deleteNoteInternal =
  (app: FirebaseApp) =>
  (id: string): Promise<void> =>
    deleteDoc(getNoteDocRef(app, id));
