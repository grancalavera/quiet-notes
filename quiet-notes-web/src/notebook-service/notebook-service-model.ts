import firebase from "firebase";
import { Note } from "../notebook/notebook-model";
import { nanoid } from "nanoid";

export interface NoteReadModel {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly _updatedAt?: firebase.firestore.Timestamp;
  readonly _createdAt?: firebase.firestore.Timestamp;
  readonly author: string;
}

export interface NoteWriteModel {
  id: string;
  title: string;
  content: string;
  _updatedAt: firebase.firestore.FieldValue;
  _createdAt?: firebase.firestore.FieldValue;
  author: string;
}

export const authorToWriteModel = (author: string): NoteWriteModel => ({
  id: nanoid(),
  title: "",
  content: "",
  author,
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
  _updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
});
