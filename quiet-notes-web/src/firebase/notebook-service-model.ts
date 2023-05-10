import {
  DocumentData,
  FieldValue,
  FirestoreDataConverter,
  increment,
  QueryDocumentSnapshot,
  serverTimestamp,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";
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
  readonly content: string;
  readonly author: string;
  readonly _version: FieldValue;
  readonly _updatedAt: FieldValue;
  readonly _createdAt?: FieldValue;
}

const noteFromReadModel = ({
  _createdAt,
  _updatedAt,
  clock,
  ...note
}: NoteReadModel): Note => ({
  ...note,
  _createdAt: _createdAt?.toDate(),
  _updatedAt: _updatedAt?.toDate(),
  // because really old notes don't have a clock
  clock: clock ?? initialize(clientId),
});

const noteToWriteModel = ({
  _createdAt,
  _updatedAt,
  ...note
}: Note): NoteWriteModel => ({
  ...note,
  _version: increment(1),
  _updatedAt: serverTimestamp(),
  ...(note._version === 0 && { _createdAt: serverTimestamp() }),
});

export const noteConverter: FirestoreDataConverter<Note> = {
  toFirestore: (note: Note): DocumentData => noteToWriteModel(note),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<NoteReadModel>,
    options?: SnapshotOptions
  ): Note => noteFromReadModel({ ...snapshot.data(options), id: snapshot.id }),
};
