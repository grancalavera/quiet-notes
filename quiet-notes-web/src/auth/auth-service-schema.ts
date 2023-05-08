import { QNRole, QNUserRecord } from "quiet-notes-lib";
import { Observable } from "rxjs";

export interface AuthServiceSchema {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;

  authenticated$: Observable<boolean>;
  user$: Observable<QNUserRecord>;
  roles$: Observable<QNRole[]>;
}
