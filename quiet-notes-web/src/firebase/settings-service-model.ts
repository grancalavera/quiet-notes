import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import {
  Settings,
  defaultSettings,
  settingsSchema,
} from "../settings/settings-model";

export const settingsConverter: FirestoreDataConverter<Settings | undefined> = {
  toFirestore: (settings): DocumentData => settings ?? {},
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<Settings>,
    options: SnapshotOptions
  ): Settings => {
    const candidate = snapshot.data(options);
    const result = settingsSchema.safeParse(candidate);
    return result.success ? result.data : defaultSettings;
  },
};
