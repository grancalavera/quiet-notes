import create, { State } from "zustand";

type QuietNotesTheme = "light" | "dark";

interface ThemeState {
  className?: string;
  theme: QuietNotesTheme;
  toggle: () => void;
}

const key = "quiet-notes-theme";

const loadTheme = (): QuietNotesTheme =>
  (localStorage.getItem(key) as QuietNotesTheme | null) ?? "light";

const saveTheme = (theme: QuietNotesTheme): void => localStorage.setItem(key, theme);

export const useTheme = create<ThemeState & State>((set, get) => ({
  theme: loadTheme(),
  toggle: () =>
    set(() => {
      const theme: QuietNotesTheme = get().theme === "light" ? "dark" : "light";
      const className = theme === "dark" ? "bp3-dark" : undefined;
      saveTheme(theme);
      return { theme, className };
    }),
}));
