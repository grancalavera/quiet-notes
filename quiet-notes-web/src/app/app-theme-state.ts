import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { startWith, tap } from "rxjs/operators";

type QuietNotesTheme = "light" | "dark";

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

const [changeThemeSignal$, changeTheme] = createSignal<QuietNotesTheme>();

export const [useAppTheme] = bind(changeThemeSignal$.pipe(tap(saveTheme)), loadTheme());

export const useToggleAppTheme = () => {
  const current = useAppTheme();

  return useCallback(() => {
    const next: QuietNotesTheme = current === "dark" ? "light" : "dark";
    changeTheme(next);
  }, [current]);
};
