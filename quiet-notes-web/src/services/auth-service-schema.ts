import { User, UserCredential } from "firebase/auth";
import { QNRole } from "quiet-notes-lib";
import { Observable } from "rxjs";

export interface AuthServiceSchema {
  signIn: () => Promise<UserCredential>;
  signOut: () => Promise<void>;

  authState$: Observable<User | null>;
  user$: Observable<User>;
  roles$: Observable<QNRole[]>;
  rolesUpdated$: Observable<Date>;
  anyRoleUpdated$: Observable<Date>;
}
