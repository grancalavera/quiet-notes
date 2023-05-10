import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { QNUserRecord } from "quiet-notes-lib";

export const userConverter: FirestoreDataConverter<QNUserRecord | undefined> = {
  toFirestore: (user: QNUserRecord): DocumentData => user,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<QNUserRecord>,
    options?: SnapshotOptions
  ): QNUserRecord => {
    // TODO: parse this using the schema
    return snapshot.data(options);
  },
};
