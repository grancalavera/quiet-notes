import create, { State } from "zustand";

type QuietNotesTheme = "light" | "dark";

interface ThemeState extends State {
  theme: QuietNotesTheme;
  toggle: () => void;
}

const key = "quiet-notes-theme";

const loadTheme = (): QuietNotesTheme =>
  (localStorage.getItem(key) as QuietNotesTheme | null) ?? "light";

const saveTheme = (theme: QuietNotesTheme): void => localStorage.setItem(key, theme);

export const useTheme = create<ThemeState>((set, get) => ({
  theme: loadTheme(),
  toggle: () =>
    set(() => {
      const theme: QuietNotesTheme = get().theme === "light" ? "dark" : "light";
      saveTheme(theme);
      return { theme };
    }),
}));
