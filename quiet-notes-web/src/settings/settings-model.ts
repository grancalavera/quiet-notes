import { produce } from "immer";
import { qnDark, qnLight } from "quiet-notes-lib";
import { assertNever } from "../lib/assert-never";
import { Settings } from "../services/settings-service-model";

export type SettingsSignal = ToggleTheme;
type ToggleTheme = { kind: "ToggleTheme" };

export const reduceSettings = (
  settings: Settings,
  signal: SettingsSignal
): Settings =>
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
