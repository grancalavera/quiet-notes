import { combineLatest, firstValueFrom } from "rxjs";
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

  getNoteById: (noteId) =>
    serviceContext$.pipe(switchMap(([db]) => getNoteByIdInternal(db, noteId))),

  createNote: async () => {
    const [db, user] = await firstValueFrom(serviceContext$);
    return createNoteInternal(db, user);
  },

  updateNote: async (note) => {
    const [db] = await firstValueFrom(serviceContext$);
    await updateNoteInternal(db, note);
  },

  deleteNote: async (noteId) => {
    const [db] = await firstValueFrom(serviceContext$);
    await deleteNoteInternal(db, noteId);
  },
};
