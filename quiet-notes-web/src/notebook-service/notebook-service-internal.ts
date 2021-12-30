import { User } from "firebase/auth";
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
import { Observable } from "rxjs";
import { Note, NoteId } from "../notebook/notebook-model";
import {
  noteConverter,
  noteFromUserUid,
  noteToWriteModel,
} from "./notebook-service-model";

const getNoteDocRef = (db: Firestore, id: string) => doc(db, "notes", id);

export const updateNoteInternal =
  (db: Firestore) =>
  (note: Note): Promise<void> => {
    const { id, ...data } = noteToWriteModel(note);
    return setDoc(getNoteDocRef(db, id), data, { merge: true });
  };

export const createNoteInternal = async (db: Firestore, user: User): Promise<string> => {
  const { id, ...data } = noteFromUserUid(user.uid);
  await setDoc(getNoteDocRef(db, id), data);
  return id;
};

export const deleteNoteInternal = async (db: Firestore, noteId: NoteId): Promise<void> =>
  deleteDoc(getNoteDocRef(db, noteId));

export const getNotesCollectionInternal = (db: Firestore, user: User) => {
  const collectionRef = collection(db, "notes").withConverter(noteConverter);
  const q = query(collectionRef, where("author", "==", user.uid));
  return collectionData(q, { idField: "id" });
};

export const getNoteByIdInternal = (db: Firestore, noteId: NoteId): Observable<Note> => {
  const noteDocRef = getNoteDocRef(db, noteId).withConverter(noteConverter);
  return docData(noteDocRef, { idField: "id" });
};
