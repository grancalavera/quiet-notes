import { QNToggleRole, QNUserRecord } from "quiet-notes-lib";
import { Observable } from "rxjs";

export type AdminServiceSchema = {
  users$: Observable<QNUserRecord[]>;
  toggleRole: (toggle: QNToggleRole) => Promise<void>;
};
