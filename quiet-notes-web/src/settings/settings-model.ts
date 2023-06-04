import { produce } from "immer";
import { UserSettings, qnDark, qnLight } from "quiet-notes-lib";
import { assertNever } from "../lib/assert-never";

export type SettingsSignal = ToggleTheme;
type ToggleTheme = { kind: "ToggleTheme" };

export const reduceSettings = (
  settings: UserSettings,
  signal: SettingsSignal
): UserSettings =>
  produce(settings, (draft) => {
    switch (signal.kind) {
      case "ToggleTheme": {
        draft.theme = draft.theme === qnLight ? qnDark : qnLight;
        break;
      }
      default:
        assertNever(signal.kind);
    }
  });
