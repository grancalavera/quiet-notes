import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { defaultTheme, qnDark, qnLight } from "quiet-notes-lib";
import { z } from "zod";

const settingsSchema = z.object({
  theme: z.union([z.literal(qnLight), z.literal(qnDark)]).default(defaultTheme),
});

export type Settings = z.infer<typeof settingsSchema>;

export const defaultSettings: Settings = {
  theme: defaultTheme,
};

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
