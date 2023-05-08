import { UserCredential } from "firebase/auth";
import { QNRole, QNUserRecord } from "quiet-notes-lib";
import { Observable } from "rxjs";

type UserId = string;

export interface AuthServiceSchema {
  signIn: () => Promise<UserCredential>;
  signOut: () => Promise<void>;

  authenticated$: Observable<boolean>;
  user$: Observable<QNUserRecord>;
  roles$: Observable<QNRole[]>;
}
