import { bind } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { combineLatest } from "rxjs";
import { map, scan, startWith } from "rxjs/operators";
import { assertNever } from "../lib/assert-never";
import { Observed } from "../lib/observed";
import { useMutation } from "../lib/use-mutation";
import { notebookService } from "../services/notebook-service";
import { hasCreatedDate, NotebookSortType, sortNotes } from "./notebook-model";

export const [sortTypeSignal$, changeSortType] =
  createSignal<NotebookSortType>();

export const [useSortType, sortTypeWithDefault$] = bind(
  sortTypeSignal$.pipe(startWith("ByDateDesc" as const))
);

export const [useNotesCollection] = bind(
  combineLatest([
    sortTypeWithDefault$,
    notebookService.getNotesCollection(),
  ]).pipe(
    map(([sortType, notes]) =>
      sortNotes(sortType, notes).filter(hasCreatedDate)
    )
  )
);

export const useCreateNote = () => useMutation(notebookService.createNote);
export const useDeleteNote = () => useMutation(notebookService.deleteNote);

const [mainNote$, openMainNote] = createSignal<string>();
const [closeMainNote$, closeMainNote] = createSignal();
const [additionalNote$, openAdditionalNote] = createSignal<string>();
const [closeAdditionalNote$, closeAdditionalNote] = createSignal();
const [deletedNoteId$, closeDeletedNote] = createSignal<string>();

export {
  openMainNote,
  closeMainNote,
  openAdditionalNote,
  closeAdditionalNote,
  closeDeletedNote,
};

const signal$ = mergeWithKey({
  mainNote$,
  additionalNote$,
  closeMainNote$,
  closeAdditionalNote$,
  deletedNoteId$,
});

type Signal = Observed<typeof signal$>;

type NotebookState = {
  additionalNoteId: string | undefined;
  mainNoteId: string | undefined;
};

const defaultNotebookState: NotebookState = {
  additionalNoteId: undefined,
  mainNoteId: undefined,
};

const reduceNotebookState = (state: NotebookState, signal: Signal) => {
  switch (signal.type) {
    case "mainNote$":
      return { ...state, mainNoteId: signal.payload };
    case "additionalNote$":
      return { ...state, additionalNoteId: signal.payload };
    case "closeMainNote$":
      return { ...state, mainNoteId: undefined };
    case "closeAdditionalNote$":
      return { ...state, additionalNoteId: undefined };
    case "deletedNoteId$":
      return reconciliateNotebookState({
        ...state,
        mainNoteId:
          state.mainNoteId === signal.payload ? undefined : state.mainNoteId,
        additionalNoteId:
          state.additionalNoteId === signal.payload
            ? undefined
            : state.additionalNoteId,
      });
    default:
      return assertNever(signal);
  }
};

const reconciliateNotebookState = (state: NotebookState): NotebookState => {
  if (state.mainNoteId === undefined) {
    return { mainNoteId: state.additionalNoteId, additionalNoteId: undefined };
  } else {
    return state;
  }
};

export const [useNotebookState, notebookState$] = bind(
  signal$.pipe(
    scan(reduceNotebookState, defaultNotebookState),
    startWith(defaultNotebookState)
  )
);

export const [useAdditionalNoteId] = bind(
  notebookState$.pipe(map((state) => state.additionalNoteId))
);

export const [useMainNoteId] = bind(
  notebookState$.pipe(map((state) => state.mainNoteId))
);

export const [useIsNoteOpen] = bind((noteId: string) =>
  notebookState$.pipe(
    map(
      (state) =>
        state.mainNoteId === noteId || state.additionalNoteId === noteId
    )
  )
);
