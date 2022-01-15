import { combineLatest } from "rxjs";
import { switchMap } from "rxjs/operators";
import { authService } from "./auth-service";
import { firestore$ } from "./firebase";
import {
  createNoteInternal,
  deleteNoteInternal,
  getNoteByIdInternal,
  getNotesCollectionInternal,
  updateNoteInternal,
} from "./notebook-service-internal";
import { NotebookServiceSchema } from "./notebook-service-schema";

const serviceContext$ = combineLatest([firestore$, authService.user$]);

export const notebookService: NotebookServiceSchema = {
  getNotesCollection: () =>
    serviceContext$.pipe(switchMap(([db, user]) => getNotesCollectionInternal(db, user))),

  createNote: () =>
    serviceContext$.pipe(switchMap(([db, user]) => createNoteInternal(db, user))),

  getNoteById: (noteId) =>
    serviceContext$.pipe(switchMap(([db]) => getNoteByIdInternal(db, noteId))),

  updateNote: (note) =>
    serviceContext$.pipe(switchMap(([db]) => updateNoteInternal(db, note))),

  deleteNote: (noteId) =>
    serviceContext$.pipe(switchMap(([db]) => deleteNoteInternal(db, noteId))),
};
