import create, { State } from "zustand";

type QuietNotesTheme = "light" | "dark";

interface ThemeState extends State {
  theme: QuietNotesTheme;
  toggle: () => void;
}

const key = "quiet-notes-theme";

const loadTheme = (): QuietNotesTheme => {
  const theme = (localStorage.getItem(key) as QuietNotesTheme | null) ?? "light";
  changeTheme(theme);
  return theme;
};

const saveTheme = (theme: QuietNotesTheme): void => {
  changeTheme(theme);
  return localStorage.setItem(key, theme);
};

const changeTheme = (theme: QuietNotesTheme): void => {
  if (theme === "dark") {
    document.body.classList.add("bp3-dark");
  } else {
    document.body.classList.remove("bp3-dark");
  }
};

export const useTheme = create<ThemeState>((set, get) => ({
  theme: loadTheme(),
  toggle: () =>
    set(() => {
      const theme: QuietNotesTheme = get().theme === "light" ? "dark" : "light";
      saveTheme(theme);
      return { theme };
    }),
}));
