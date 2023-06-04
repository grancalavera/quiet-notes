import z from "zod";
import { defaultTheme, qnDark, qnLight } from "./theme";

export const userSettingsSchema = z.object({
  theme: z.union([z.literal(qnLight), z.literal(qnDark)]).default(defaultTheme),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;

export const defaultUserSettings: UserSettings = {
  theme: defaultTheme,
};
