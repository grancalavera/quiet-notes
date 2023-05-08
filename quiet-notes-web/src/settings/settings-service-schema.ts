import { Observable } from "rxjs";
import { Settings } from "./settings-model";

export type SettingsServiceSchema = {
  settings$: Observable<Settings>;
  saveSettings: (settings: Partial<Settings>) => Promise<void>;
};
