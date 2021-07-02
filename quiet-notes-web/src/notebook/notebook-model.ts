import firebase from "firebase/app";
import { nanoid } from "nanoid";

export interface Note {
  id: string;
  title: string;
  content: string;
  author: firebase.UserInfo;
}

export interface NoteMeta {
  _createdAt: Date;
  _updatedAt: Date;
}

export interface WriteNoteStub extends Note {
  _createdAt: firebase.firestore.FieldValue;
  _updatedAt: firebase.firestore.FieldValue;
}

export interface WriteNoteUpdate extends Note {
  _updatedAt: firebase.firestore.FieldValue;
}

export interface ReadNote extends Note {
  _createdAt: Date;
  _updatedAt: Date;
}

export interface FirebaseReadNoteMeta {
  _createdAt: firebase.firestore.Timestamp;
  _updatedAt: firebase.firestore.Timestamp;
}

export const writeNoteStub = (author: firebase.UserInfo): WriteNoteStub => ({
  author,
  id: nanoid(),
  title: "",
  content: "",
  _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});

export const writeNoteUpdate = (note: Note): WriteNoteUpdate => ({
  ...note,
  _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});
