export const qnLight = "light" as const;
export const qnDark = "dark" as const;
export const themes = [qnLight, qnDark] as const;
export const defaultTheme = qnLight;
export type QNTheme = (typeof themes)[number];
