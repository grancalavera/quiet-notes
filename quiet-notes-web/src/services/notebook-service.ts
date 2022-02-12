import { combineLatest } from "rxjs";
import { switchMap, take, tap } from "rxjs/operators";
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

  getNoteById: (noteId) =>
    serviceContext$.pipe(switchMap(([db]) => getNoteByIdInternal(db, noteId))),

  createNote: () =>
    serviceContext$.pipe(
      switchMap(([db, user]) => createNoteInternal(db, user)),
      take(1)
    ),

  updateNote: (note) =>
    serviceContext$.pipe(
      switchMap(([db]) => updateNoteInternal(db, note)),
      take(1)
    ),

  deleteNote: (noteId) =>
    serviceContext$.pipe(
      switchMap(([db]) => deleteNoteInternal(db, noteId)),
      take(1)
    ),
};
