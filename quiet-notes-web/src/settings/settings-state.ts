import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import {
  catchError,
  concat,
  distinctUntilChanged,
  filter,
  first,
  ignoreElements,
  scan,
  shareReplay,
  startWith,
  switchMap,
} from "rxjs";
import { QNError } from "../app/app-error";
import { handleError } from "../app/app-error-state";
import { authService } from "../firebase/auth-service";
import { settingsService } from "../firebase/settings-service";
import { peek } from "../lib/peek";
import {
  SettingsSignal,
  defaultSettings,
  reduceSettings,
} from "./settings-model";

const [signal$, sendSignal] = createSignal<SettingsSignal>();
export const toggleTheme = () => sendSignal({ kind: "ToggleTheme" });

const loadSettings$ = settingsService.settings$.pipe(
  catchError((error, caught) => {
    handleError(new QNError("Failed to load user settings.", error));
    return caught;
  }),
  first(),
  startWith(defaultSettings),
  peek("remote settings")
);

export const [useSettings, settings$] = bind(
  loadSettings$.pipe(
    switchMap((settings) =>
      signal$.pipe(scan(reduceSettings, settings), startWith(settings))
    ),
    peek("local settings"),
    shareReplay(1)
  ),
  defaultSettings
);

const updateSettings$ = concat(
  authService.user$.pipe(first(), ignoreElements()),
  settings$.pipe(
    filter((candidate) => candidate !== defaultSettings),
    distinctUntilChanged()
  )
);

updateSettings$
  .pipe(
    peek("save settings"),
    switchMap(settingsService.saveSettings),
    catchError((error, caught) => {
      handleError(new QNError("Failed to save settings.", error));
      return caught;
    })
  )
  .subscribe(() => {
    console.log("settings saved");
  });
