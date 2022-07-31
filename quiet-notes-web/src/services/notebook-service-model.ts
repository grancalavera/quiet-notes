import {
  DocumentData,
  FieldValue,
  increment,
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { clientId } from "../app/app-model";
import { Clock, initialize } from "../crdt/clock";
import { Note } from "../notebook/notebook-model";

export interface NoteReadModel {
  readonly id: string;
  readonly content: string;
  readonly _updatedAt?: Timestamp;
  readonly _createdAt?: Timestamp;
  readonly _version: number;
  readonly author: string;
  readonly clock?: Clock;
}

export interface NoteWriteModel {
  id: string;
  content: string;
  author: string;
  _version: FieldValue;
  _updatedAt: FieldValue;
  _createdAt?: FieldValue;
}

export const noteFromUserUid = (author: string): NoteWriteModel => ({
  id: nanoid(),
  content: "",
  author,
  _version: increment(1),
  _updatedAt: serverTimestamp(),
  _createdAt: serverTimestamp(),
});

export const noteFromReadModel = (documentData: NoteReadModel): Note => {
  const { _createdAt, _updatedAt, clock, ...note } = documentData;

  return {
    _createdAt: _createdAt?.toDate(),
    _updatedAt: _updatedAt?.toDate(),
    clock: clock ?? initialize(clientId),
    ...note,
  };
};

export const noteToWriteModel = ({ _createdAt, _updatedAt, ...note }: Note): NoteWriteModel => ({
  ...note,
  _version: increment(1),
  _updatedAt: serverTimestamp(),
});

export const noteConverter = {
  toFirestore: (note: Note): DocumentData => noteToWriteModel(note),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<NoteReadModel>,
    options?: SnapshotOptions
  ): Note => {
    const data = snapshot.data(options);
    return noteFromReadModel(data);
  },
};
