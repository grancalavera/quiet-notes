import { nanoid } from "nanoid";
import { Note } from "../notebook/notebook-model";
import { Timestamp, FieldValue, serverTimestamp, increment } from "firebase/firestore";

export interface NoteReadModel {
  readonly id: string;
  readonly content: string;
  readonly _updatedAt?: Timestamp;
  readonly _createdAt?: Timestamp;
  readonly _version: number;
  readonly author: string;
}

export interface NoteWriteModel {
  id: string;
  content: string;
  author: string;
  _version: FieldValue;
  _updatedAt: FieldValue;
  _createdAt?: FieldValue;
}

export const authorToWriteModel = (author: string): NoteWriteModel => ({
  id: nanoid(),
  content: "",
  author,
  _version: increment(1),
  _updatedAt: serverTimestamp(),
  _createdAt: serverTimestamp(),
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
  _version: increment(1),
  _updatedAt: serverTimestamp(),
});
