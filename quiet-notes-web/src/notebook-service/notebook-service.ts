import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  DocumentData,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  where,
} from "firebase/firestore";
import { collectionData } from "rxfire/firestore";
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
import { Note } from "../notebook/notebook-model";
import { getNoteDocRef, useNoteInternal } from "./notebook-service-internal";
import {
  authorToWriteModel,
  noteFromReadModel,
  NoteReadModel,
  noteToWriteModel,
} from "./notebook-service-model";

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

const serviceContext$ = combineLatest([firebaseApp$, user$]);

export const createNote = () =>
  serviceContext$.pipe(switchMap(([app, user]) => createNoteInternal(app, user)));

export const getNotesCollection = () =>
  serviceContext$.pipe(switchMap(([app, user]) => getNotesCollectionInternal(app, user)));

const createNoteInternal = async (app: FirebaseApp, user: User): Promise<string> => {
  const { id, ...data } = authorToWriteModel(user.uid);
  await setDoc(getNoteDocRef(app, id), data);
  return id;
};

const getNotesCollectionInternal = (app: FirebaseApp, user: User) => {
  const collectionRef = collection(getFirestore(app), "notes").withConverter(
    noteConverter
  );

  const q = query(collectionRef, where("author", "==", user.uid));

  return collectionData(q, { idField: "id" });
};

const noteConverter = {
  toFirestore: (note: Note): DocumentData => noteToWriteModel(note),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<NoteReadModel>,
    options?: SnapshotOptions
  ): Note => {
    const data = snapshot.data(options);
    return noteFromReadModel(data);
  },
};
