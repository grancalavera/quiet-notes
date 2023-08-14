import { bind } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { produce } from "immer";
import { map, scan, shareReplay, startWith } from "rxjs";
import { notebookService } from "../firebase/notebook-service";
import { assertNever } from "../lib/assert-never";
import {
  Note,
  NotebookSortType,
  hasCreatedDate,
  sortNotes,
} from "./notebook-model";

export { changeSortType, useNotesCollection, useSortType };

type State = {
  notes: Note[];
  sortType: NotebookSortType;
};

const initialState: State = {
  notes: [],
  sortType: "ByDateDesc",
};

const [changeSortType$, changeSortType] = createSignal<NotebookSortType>();

const notesCollection$ = notebookService.getNotesCollection().pipe(
  map((x) => x.filter(hasCreatedDate)),
  startWith(initialState.notes),
  shareReplay(1)
);

const state$ = mergeWithKey({ changeSortType$, notesCollection$ }).pipe(
  scan(
    (state, signal) =>
      produce(state, (draft) => {
        {
          switch (signal.type) {
            case "changeSortType$": {
              draft.sortType = signal.payload;
              draft.notes = sortNotes(signal.payload, draft.notes);
              break;
            }
            case "notesCollection$": {
              draft.notes = sortNotes(state.sortType, signal.payload);
              break;
            }
            default:
              assertNever(signal);
          }
        }
      }),

    initialState
  ),
  startWith(initialState),
  shareReplay(1)
);

const [useNotesCollection] = bind(state$.pipe(map((x) => x.notes)));
const [useSortType] = bind(state$.pipe(map((x) => x.sortType)));
