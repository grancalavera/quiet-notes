import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { defer, of } from "rxjs";
import { scan, startWith, switchMap, tap } from "rxjs/operators";

type QuietNotesTheme = "light" | "dark";

const [signal$, toggleTheme] = createSignal<void>();
export { toggleTheme };

export const [useAppTheme] = bind<QuietNotesTheme>(
  defer(() => of(loadTheme())).pipe(
    switchMap((initialTheme) =>
      signal$.pipe(
        scan((theme) => (theme === "dark" ? "light" : "dark"), initialTheme),
        startWith(initialTheme)
      )
    ),
    tap((theme) => {
      applyColorScheme(theme);
      saveTheme(theme);
    })
  ),
  "light"
);

const applyColorScheme = (mode: QuietNotesTheme) => {
  const html = document.querySelector("html")!;
  html.style.colorScheme = mode;
};

const key = "quiet-notes-theme";

const loadTheme = (): QuietNotesTheme => {
  const theme =
    (localStorage.getItem(key) as QuietNotesTheme | null) ?? "light";
  return theme;
};

const saveTheme = (theme: QuietNotesTheme): void => {
  localStorage.setItem(key, theme);
};
