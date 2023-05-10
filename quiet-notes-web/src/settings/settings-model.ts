import { produce } from "immer";
import { qnDark, qnLight } from "quiet-notes-lib";
import { assertNever } from "../lib/assert-never";

import { defaultTheme } from "quiet-notes-lib";
import { z } from "zod";

export const settingsSchema = z.object({
  theme: z.union([z.literal(qnLight), z.literal(qnDark)]).default(defaultTheme),
});

export type Settings = z.infer<typeof settingsSchema>;

export const defaultSettings: Settings = {
  theme: defaultTheme,
};

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
