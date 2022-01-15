import create from "zustand";

type QuietNotesTheme = "light" | "dark";

interface ThemeState {
  theme: QuietNotesTheme;
  toggle: () => void;
}

const key = "quiet-notes-theme";

const applyColorScheme = (mode: QuietNotesTheme) => {
  const html = document.querySelector("html")!;
  html.style.colorScheme = mode;
};

const loadTheme = (): QuietNotesTheme => {
  const theme = (localStorage.getItem(key) as QuietNotesTheme | null) ?? "light";
  applyColorScheme(theme);
  return theme;
};

const saveTheme = (theme: QuietNotesTheme): void => {
  applyColorScheme(theme);
  localStorage.setItem(key, theme);
};

const useTheme = create<ThemeState>((set, get) => ({
  theme: loadTheme(),
  toggle: () =>
    set(() => {
      const theme: QuietNotesTheme = get().theme === "light" ? "dark" : "light";
      saveTheme(theme);
      return { theme };
    }),
}));

export const useAppTheme = () => useTheme((s) => s.theme);

export const useToggleAppTheme = () => useTheme((s) => s.toggle);
