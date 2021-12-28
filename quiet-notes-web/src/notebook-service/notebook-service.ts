import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { deleteDoc, Firestore, getFirestore, setDoc } from "firebase/firestore";
import { combineLatest, from, Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { useErrorHandler } from "../app/app-state";
import { user$ } from "../auth/user-streams";
import {
  FirebaseErrorHandlerOptions,
  useFirebaseErrorHandler,
} from "../firebase/firebase-error-handler";
import { firebaseApp$, useFirebase } from "../firebase/firebase-initialize";
import { useFirebaseMutation } from "../firebase/firebase-mutation";
import { Note, NoteId } from "../notebook/notebook-model";
import { hasOwnProperty } from "../utils/has-own-property";
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

interface NotebookService {
  createNote: () => Observable<NoteId>;
}

interface NotebookServiceContext {
  app: FirebaseApp;
  user: User;
}

const notebookServiceRuntime: ServiceRuntime<NotebookService, NotebookServiceContext> = {
  createNote: (context) => () => {
    const { app, user } = context;
    const { id, ...data } = authorToWriteModel(user.uid);
    return from(setDoc(getNoteDocRef(app, id), data)).pipe(map(() => id));
  },
};

export const notebookService$: Observable<NotebookService> = combineLatest([
  firebaseApp$,
  user$,
]).pipe(map(([app, user]) => createService(notebookServiceRuntime, { app, user })));

type ServiceRuntime<TSchema extends {}, TContext> = {
  [Key in keyof TSchema]: (context: TContext) => TSchema[Key];
};

export const createService = <TSchema extends {}, TContext>(
  runtime: ServiceRuntime<TSchema, TContext>,
  context: TContext
): TSchema => {
  const descriptors = Object.keys(runtime).map((property) => {
    const descriptor: PropertyDescriptor = {
      enumerable: true,
      configurable: false,
      writable: false,
      value: getOperation(runtime, context, property),
    };

    return [property, descriptor] as const;
  });

  return Object.defineProperties({} as TSchema, Object.fromEntries(descriptors));
};

const getOperation = <TSchema extends {}, TContext>(
  runtime: ServiceRuntime<TSchema, TContext>,
  context: TContext,
  name: string
) => {
  if (hasOwnProperty(runtime, name)) {
    const createOperation = runtime[name as keyof TSchema];
    return createOperation(context);
  } else {
    return undefined;
  }
};
