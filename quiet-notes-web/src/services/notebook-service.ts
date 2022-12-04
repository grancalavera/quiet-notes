import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { collectionData } from "rxfire/firestore";
import { combineLatest, firstValueFrom, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { Note } from "../notebook/notebook-model";
import { authService } from "./auth-service";
import { firestore$ } from "./firebase";
import {
  noteConverter,
  noteFromUserUid,
  noteToWriteModel,
} from "./notebook-service-model";
import { NotebookServiceSchema } from "./notebook-service-schema";

const getNoteDocRef = (firestore: Firestore, id: string) =>
  doc(firestore, "notes", id);

const documentOptions = { idField: "id" };

const serviceContext$ = combineLatest([firestore$, authService.user$]).pipe(
  map(([firestore, user]) => ({ firestore, user }))
);

export const notebookService: NotebookServiceSchema = {
  getNotesCollection: () =>
    serviceContext$.pipe(
      switchMap((context) => {
        const { firestore, user } = context;
        const collectionRef = collection(firestore, "notes").withConverter(
          noteConverter
        );
        const q = query(collectionRef, where("author", "==", user.uid));
        return collectionData(q, documentOptions);
      })
    ),
  getNoteById: (noteId) =>
    firestore$.pipe(
      switchMap(
        (firestore) =>
          new Observable<Note>((subscriber) => {
            const unsubscribe = onSnapshot(
              getNoteDocRef(firestore, noteId).withConverter(noteConverter),
              (snap) => snap.exists() && subscriber.next(snap.data()),
              (error) => subscriber.error(error)
            );
            return unsubscribe;
          })
      )
    ),

  createNote: async () => {
    const { firestore, user } = await firstValueFrom(serviceContext$);
    const { id, ...data } = noteFromUserUid(user.uid);
    await setDoc(getNoteDocRef(firestore, id), data);
    return id;
  },

  saveNote: async (note) => {
    const { firestore } = await firstValueFrom(serviceContext$);
    const { id, ...data } = noteToWriteModel(note);
    return setDoc(getNoteDocRef(firestore, id), data, { merge: true });
  },

  deleteNote: async (noteId) => {
    const { firestore } = await firstValueFrom(serviceContext$);
    return deleteDoc(getNoteDocRef(firestore, noteId));
  },
};
