import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import {
  UserSettings,
  defaultUserSettings,
  userSettingsSchema,
} from "quiet-notes-lib";

export const settingsConverter: FirestoreDataConverter<
  UserSettings | undefined
> = {
  toFirestore: (settings): DocumentData => settings ?? {},
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<UserSettings>,
    options: SnapshotOptions
  ): UserSettings => {
    const candidate = snapshot.data(options);
    const result = userSettingsSchema.safeParse(candidate);
    return result.success ? result.data : defaultUserSettings;
  },
};
