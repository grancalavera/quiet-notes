import { collection } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { QNToggleRole } from "quiet-notes-lib";
import { collectionData } from "rxfire/firestore";
import { firstValueFrom, map, switchMap } from "rxjs";
import { AdminServiceSchema } from "../admin/admin-service-schema";
import { userConverter } from "./auth-service-model";
import { firestore$, functions$ } from "./firebase";

const toggleRole = async (toggle: QNToggleRole): Promise<void> => {
  const functions = await firstValueFrom(functions$);
  await httpsCallable<QNToggleRole>(functions, "toggleRole")(toggle);
};

const users$ = firestore$.pipe(
  switchMap((firestore) => {
    const ref = collection(firestore, "users").withConverter(userConverter);
    return collectionData(ref);
  }),
  map(removeNullables)
);

export const adminService: AdminServiceSchema = {
  users$,
  toggleRole,
};
