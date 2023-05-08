import { doc, Firestore, setDoc } from "firebase/firestore";
import { docData } from "rxfire/firestore";
import { combineLatest, filter, firstValueFrom, map, switchMap } from "rxjs";
import { authService } from "./auth-service";
import { firestore$ } from "./firebase";
import { settingsConverter } from "./settings-service-model";
import { SettingsServiceSchema } from "../settings/settings-service-schema";

const settingsRef = (firestore: Firestore, id: string) =>
  doc(firestore, "settings", id).withConverter(settingsConverter);

const serviceContext$ = combineLatest([firestore$, authService.user$]).pipe(
  map(([firestore, user]) => ({ firestore, user }))
);

export const settingsService: SettingsServiceSchema = {
  settings$: serviceContext$.pipe(
    switchMap(({ firestore, user }) => {
      const ref = settingsRef(firestore, user.uid);
      return docData(ref).pipe(filter(Boolean));
    })
  ),
  saveSettings: async (settings) => {
    const { firestore, user } = await firstValueFrom(serviceContext$);
    const ref = settingsRef(firestore, user.uid);
    return setDoc(ref, settings, { merge: true });
  },
};
