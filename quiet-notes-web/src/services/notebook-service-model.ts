import { nanoid } from "nanoid";
import {
  Timestamp,
  FieldValue,
  serverTimestamp,
  increment,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Firestore,
} from "firebase/firestore";
import { Note } from "../notebook/notebook-model";
import { User } from "firebase/auth";
import { Clock } from "../crdt/clock";
import * as vClock from "../crdt/clock";

export interface NotebookServiceContext {
  firestore: Firestore;
  user: User;
  clientId: string;
}

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
  clock: Clock;
  _version: FieldValue;
  _updatedAt: FieldValue;
  _createdAt?: FieldValue;
}

export const noteFromUserUid = (author: string, clientId: string): NoteWriteModel => ({
  id: nanoid(),
  content: "",
  author,
  clock: vClock.initialize(clientId),
  _version: increment(1),
  _updatedAt: serverTimestamp(),
  _createdAt: serverTimestamp(),
});

const readClock = (clientId: string, clock: Clock | undefined): Clock => {
  // The received clock. For backwards compatibility we accept undefined clocks, and
  // replace them by the empty clock.
  const received: Clock = clock ?? vClock.empty();

  // The initial clock is always required, to cover the scenario in which the current
  // client doesn't exist in the received clock.
  const initial = vClock.initialize(clientId);

  // The current clock is a calculation that ensures the latest time is always preserved
  // for the current client. If the current client didn't exist in the received clock,
  // the time from the initial clock, 0, is going to be preserved.
  const current = vClock.merge(received, initial);

  // The final clock is the current clock with the time for the current client incremented,
  // which accounts for the client acknowledging the event for reading the note.
  const final = vClock.increment(clientId, current);

  return final;
};

export const noteFromReadModel = (documentData: NoteReadModel, clientId: string): Note => {
  const { _createdAt, _updatedAt, ...note } = documentData;

  const clock = readClock(clientId, note.clock);

  console.log({ clock });

  return {
    ...note,
    clock,
    _createdAt: _createdAt?.toDate(),
    _updatedAt: _updatedAt?.toDate(),
  };
};

export const noteToWriteModel = (
  { _createdAt, _updatedAt, clock, ...note }: Note,
  clientId: string
): NoteWriteModel => ({
  ...note,
  clock: vClock.increment(clientId, clock),
  _version: increment(1),
  _updatedAt: serverTimestamp(),
});

export const noteConverter = (context: NotebookServiceContext) => ({
  toFirestore: (note: Note): DocumentData => noteToWriteModel(note, context.clientId),
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<NoteReadModel>,
    options?: SnapshotOptions
  ): Note => {
    const data = snapshot.data(options);
    return noteFromReadModel(data, context.clientId);
  },
});
