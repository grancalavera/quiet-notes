import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { QNUserRecord, userSchema } from "quiet-notes-lib";

export const userConverter: FirestoreDataConverter<QNUserRecord | undefined> = {
  toFirestore: (user: QNUserRecord): DocumentData => user,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<QNUserRecord>,
    options?: SnapshotOptions
  ): QNUserRecord => userSchema.parse(snapshot.data(options)),
};
