import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { combineLatest, merge } from "rxjs";
import { distinctUntilChanged, map, startWith, tap } from "rxjs/operators";
import { globalHistory, location$ } from "../app/app-history";
import { createLoadResult } from "../lib/load-result-observable";
import { notebookService } from "../services/notebook-service";
import { isNoteWithDates, NotebookSortType, NoteId, sortNotes } from "./notebook-model";

const [sortTypeSignal$, changeSortType] = createSignal<NotebookSortType>();

const [useSortType, sortTypeWithDefault$] = bind(sortTypeSignal$, "ByDateDesc");

const [useNotesCollection] = bind(
  combineLatest([sortTypeWithDefault$, notebookService.getNotesCollection()]).pipe(
    map(([sortType, notes]) => sortNotes(sortType, notes).filter(isNoteWithDates))
  )
);

const [changeSelectedNoteSignal$, changeSelectedNote] = createSignal<
  string | undefined
>();

const selectedNoteFromDeepLink$ = location$.pipe(
  map(({ pathname }) => pathname.match(/^\/notebook\/(.+)\/?$/)?.[1])
);

const selectedNoteFromUser$ = changeSelectedNoteSignal$.pipe(
  tap((noteId) => globalHistory.push(`/notebook/${noteId ?? ""}`))
);

const [useSelectedNoteId] = bind(
  merge(selectedNoteFromDeepLink$, selectedNoteFromUser$).pipe(
    distinctUntilChanged(),
    startWith(undefined)
  )
);

const [createNoteSignal$, createNote] = createSignal<void>();

const [useCreateNoteResult] = bind(
  createLoadResult(createNoteSignal$, notebookService.createNote)
);

const [deleteNoteSignal$, deleteNote] = createSignal<NoteId>();

const [, deleteNoteResult$] = bind(
  createLoadResult(deleteNoteSignal$, notebookService.deleteNote)
);

const openNote = (noteId: string) => changeSelectedNote(noteId);

const closeNote = () => changeSelectedNote(undefined);

// public API
export {
  changeSortType,
  useSortType,
  useNotesCollection,
  //
  openNote,
  closeNote,
  useSelectedNoteId,
  //
  createNote,
  useCreateNoteResult,
  //
  deleteNote,
  deleteNoteResult$,
};
