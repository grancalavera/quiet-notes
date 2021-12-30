import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { collectionData, docData } from "rxfire/firestore";
import { Observable } from "rxjs";
import { Note, NoteId } from "../notebook/notebook-model";
import {
  noteConverter,
  noteFromUserUid,
  noteToWriteModel,
} from "./notebook-service-model";

interface NotebookServiceOptions<
  TDocument = unknown,
  TData = TDocument,
  IdField extends string = ""
> {
  transform: (document: TDocument) => TData;
  idField: IdField;
}

const getNoteDocRef = (app: FirebaseApp, id: string) =>
  doc(getFirestore(app), "notes", id);

export const updateNoteInternal =
  (app: FirebaseApp) =>
  (note: Note): Promise<void> => {
    const { id, ...data } = noteToWriteModel(note);
    return setDoc(getNoteDocRef(app, id), data, { merge: true });
  };

export const deleteNoteInternal =
  (app: FirebaseApp) =>
  (id: string): Promise<void> =>
    deleteDoc(getNoteDocRef(app, id));

export const createNoteInternal = async (
  app: FirebaseApp,
  user: User
): Promise<string> => {
  const { id, ...data } = noteFromUserUid(user.uid);
  await setDoc(getNoteDocRef(app, id), data);
  return id;
};

export const getNotesCollectionInternal = (app: FirebaseApp, user: User) => {
  const collectionRef = collection(getFirestore(app), "notes").withConverter(
    noteConverter
  );
  const q = query(collectionRef, where("author", "==", user.uid));
  return collectionData(q, { idField: "id" });
};

export const getNoteByIdInternal = (
  app: FirebaseApp,
  noteId: NoteId
): Observable<Note> => {
  const noteDocRef = getNoteDocRef(app, noteId).withConverter(noteConverter);
  return docData(noteDocRef, { idField: "id" });
};
