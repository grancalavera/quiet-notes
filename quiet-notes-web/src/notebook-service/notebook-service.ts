import { combineLatest } from "rxjs";
import { switchMap } from "rxjs/operators";
import { useErrorHandler } from "../app/app-state";
import { user$ } from "../auth/user-streams";
import {
  FirebaseErrorHandlerOptions,
  useFirebaseErrorHandler,
} from "../firebase/firebase-error-handler";
import { firebaseApp$, useFirebase } from "../firebase/firebase-initialize";
import { useFirebaseMutation } from "../firebase/firebase-mutation";
import { NotebookServiceSchema } from "./noetbook-service-schema";
import {
  createNoteInternal,
  deleteNoteInternal,
  getNotesCollectionInternal,
  updateNoteInternal,
  useNoteInternal,
} from "./notebook-service-internal";
import { noteFromReadModel } from "./notebook-service-model";

const serviceContext$ = combineLatest([firebaseApp$, user$]);

export const notebookService: NotebookServiceSchema = {
  getNotesCollection: () =>
    serviceContext$.pipe(
      switchMap(([app, user]) => getNotesCollectionInternal(app, user))
    ),

  createNote: () =>
    serviceContext$.pipe(switchMap(([app, user]) => createNoteInternal(app, user))),

  getNoteById: (id) => {
    throw new Error("getNoteById not implemented");
  },

  updateNote: (note) => {
    throw new Error("updateNote not implemented");
  },

  deleteNote: (id) => {
    throw new Error("deleteNote not implemented");
  },
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
