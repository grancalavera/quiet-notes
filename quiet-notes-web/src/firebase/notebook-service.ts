import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { collectionData, docData } from "rxfire/firestore";
import { combineLatest, firstValueFrom } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { createNote } from "../notebook/notebook-model";
import { authService } from "./auth-service";
import { firestore$ } from "./firebase";
import { noteConverter } from "./notebook-service-model";
import { NotebookServiceSchema } from "../notebook/notebook-service-schema";

const noteRef = (firestore: Firestore, id: string) =>
  doc(firestore, "notes", id).withConverter(noteConverter);

const serviceContext$ = combineLatest([firestore$, authService.user$]).pipe(
  map(([firestore, user]) => ({ firestore, user }))
);

export const notebookService: NotebookServiceSchema = {
  getNotesCollection: () =>
    serviceContext$.pipe(
      switchMap(({ firestore, user }) => {
        const ref = collection(firestore, "notes").withConverter(noteConverter);
        const q = query(ref, where("author", "==", user.uid));
        return collectionData(q);
      })
    ),

  getNoteById: (noteId) =>
    serviceContext$.pipe(
      switchMap(({ firestore }) => {
        const ref = noteRef(firestore, noteId);
        return docData(ref);
      })
    ),

  createNote: async (content) => {
    const { firestore, user } = await firstValueFrom(serviceContext$);
    const note = createNote(user.uid, content);
    await setDoc(noteRef(firestore, note.id), note);
    return note.id;
  },

  saveNote: async (note) => {
    const { firestore } = await firstValueFrom(serviceContext$);
    return setDoc(noteRef(firestore, note.id), note, { merge: true });
  },

  deleteNote: async (noteId) => {
    const { firestore } = await firstValueFrom(serviceContext$);
    return deleteDoc(noteRef(firestore, noteId));
  },
};
