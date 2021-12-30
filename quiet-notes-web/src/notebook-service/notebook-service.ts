import { combineLatest } from "rxjs";
import { switchMap } from "rxjs/operators";
import { useErrorHandler } from "../app/app-state";
import { user$ } from "../auth/user-streams";
import { firestore$, useFirestore } from "../firebase/firebase-initialize";
import { useFirebaseMutation } from "../firebase/firebase-mutation";
import { NotebookServiceSchema } from "./notebook-service-schema";
import {
  createNoteInternal,
  deleteNoteInternal,
  getNoteByIdInternal,
  getNotesCollectionInternal,
  updateNoteInternal,
} from "./notebook-service-internal";

const serviceContext$ = combineLatest([firestore$, user$]);

export const notebookService: NotebookServiceSchema = {
  getNotesCollection: () =>
    serviceContext$.pipe(switchMap(([db, user]) => getNotesCollectionInternal(db, user))),

  createNote: () =>
    serviceContext$.pipe(switchMap(([db, user]) => createNoteInternal(db, user))),

  getNoteById: (noteId) =>
    serviceContext$.pipe(switchMap(([db]) => getNoteByIdInternal(db, noteId))),

  updateNote: (note) => {
    throw new Error("updateNote not implemented");
  },

  deleteNote: (noteId) =>
    serviceContext$.pipe(switchMap(([db]) => deleteNoteInternal(db, noteId))),
};

export const useUpdateNote = () => {
  const db = useFirestore();
  return useFirebaseMutation(updateNoteInternal(db), { onError: useErrorHandler() });
};
