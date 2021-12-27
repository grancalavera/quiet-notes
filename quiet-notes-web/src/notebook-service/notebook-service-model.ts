import firebase from "firebase/compat/app";
import { nanoid } from "nanoid";
import { Note } from "../notebook/notebook-model";

export interface NoteReadModel {
  readonly id: string;
  readonly content: string;
  readonly _updatedAt?: firebase.firestore.Timestamp;
  readonly _createdAt?: firebase.firestore.Timestamp;
  readonly _version: number;
  readonly author: string;
}

export interface NoteWriteModel {
  id: string;
  content: string;
  author: string;
  _version: firebase.firestore.FieldValue;
  _updatedAt: firebase.firestore.FieldValue;
  _createdAt?: firebase.firestore.FieldValue;
}

export const authorToWriteModel = (author: string): NoteWriteModel => ({
  id: nanoid(),
  content: "",
  author,
  _version: firebase.firestore.FieldValue.increment(1),
  _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  _createdAt: firebase.firestore.FieldValue.serverTimestamp(),
});

export const noteFromReadModel = (documentData: NoteReadModel): Note => {
  const { _createdAt, _updatedAt, ...note } = documentData;
  return {
    _createdAt: _createdAt?.toDate(),
    _updatedAt: _updatedAt?.toDate(),
    ...note,
  };
};

export const noteToWriteModel = ({
  _createdAt,
  _updatedAt,
  ...note
}: Note): NoteWriteModel => ({
  ...note,
  _version: firebase.firestore.FieldValue.increment(1),
  _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});
