import { UserSettings } from "quiet-notes-lib";
import { Observable } from "rxjs";

export type SettingsServiceSchema = {
  settings$: Observable<UserSettings>;
  saveSettings: (settings: Partial<UserSettings>) => Promise<void>;
};
