import { collection, deleteDoc, doc, Firestore, query, setDoc, where } from "firebase/firestore";
import { collectionData, docData } from "rxfire/firestore";
import { combineLatest, firstValueFrom, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { appService } from "./app-service";
import { authService } from "./auth-service";
import { firestore$ } from "./firebase";
import {
  NotebookServiceContext,
  noteConverter,
  noteFromUserUid,
  noteToWriteModel,
} from "./notebook-service-model";
import { NotebookServiceSchema } from "./notebook-service-schema";

const getNoteDocRef = (firestore: Firestore, id: string) => doc(firestore, "notes", id);
const documentOptions = { idField: "id" };

const serviceContext$: Observable<NotebookServiceContext> = combineLatest([
  firestore$,
  authService.user$,
  appService.clientId$,
]).pipe(map(([firestore, user, clientId]) => ({ firestore, user, clientId })));

export const notebookService: NotebookServiceSchema = {
  getNotesCollection: () =>
    serviceContext$.pipe(
      switchMap((context) => {
        const { firestore, user } = context;
        const converter = noteConverter(context);
        const collectionRef = collection(firestore, "notes").withConverter(converter);
        const q = query(collectionRef, where("author", "==", user.uid));
        return collectionData(q, documentOptions);
      })
    ),

  getNoteById: (noteId) =>
    serviceContext$.pipe(
      switchMap((context) => {
        const { firestore } = context;
        const converter = noteConverter(context);
        const noteDocRef = getNoteDocRef(firestore, noteId).withConverter(converter);
        return docData(noteDocRef, documentOptions);
      })
    ),

  createNote: async () => {
    const { firestore, user, clientId } = await firstValueFrom(serviceContext$);
    const { id, ...data } = noteFromUserUid(user.uid, clientId);
    await setDoc(getNoteDocRef(firestore, id), data);
    return id;
  },

  updateNote: async (note) => {
    const { firestore, clientId } = await firstValueFrom(serviceContext$);
    const { id, ...data } = noteToWriteModel(note, clientId);
    return setDoc(getNoteDocRef(firestore, id), data, { merge: true });
  },

  deleteNote: async (noteId) => {
    const { firestore } = await firstValueFrom(serviceContext$);
    return deleteDoc(getNoteDocRef(firestore, noteId));
  },
};
