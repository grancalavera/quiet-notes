import { Observable } from "rxjs";
import { Settings } from "./settings-service-model";

export type SettingsServiceSchema = {
  settings$: Observable<Settings>;
  saveSettings: (settings: Partial<Settings>) => Promise<void>;
};
