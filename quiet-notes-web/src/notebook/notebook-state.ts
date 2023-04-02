import { bind } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import produce from "immer";
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

const reduceNotebookState = (state: NotebookState, signal: Signal) =>
  produce(state, (draft) => {
    // in the case where the additional note is undefined this is
    // effectively a no-op, otherwise it'll move the additional note
    // to the main note.
    const closeMainNote = () => {
      draft.mainNoteId = draft.additionalNoteId;
      draft.additionalNoteId = undefined;
    };

    switch (signal.type) {
      case "mainNote$":
        draft.mainNoteId = signal.payload;
        break;
      case "additionalNote$":
        draft.additionalNoteId = signal.payload;
        break;
      case "closeMainNote$":
        closeMainNote();
        break;
      case "closeAdditionalNote$":
        draft.additionalNoteId = undefined;
        break;
      case "deletedNoteId$":
        if (
          draft.additionalNoteId === draft.mainNoteId &&
          draft.mainNoteId === signal.payload
        ) {
          return defaultNotebookState;
        }

        if (draft.mainNoteId === signal.payload) {
          closeMainNote();
          break;
        }

        if (draft.additionalNoteId === signal.payload) {
          draft.additionalNoteId = undefined;
          break;
        }
        break;
      default:
        assertNever(signal);
    }
  });

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
