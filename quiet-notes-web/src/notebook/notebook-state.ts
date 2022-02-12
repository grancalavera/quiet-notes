import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { combineLatest, merge } from "rxjs";
import { distinctUntilChanged, map, startWith, tap } from "rxjs/operators";
import { globalHistory, location$ } from "../app/app-history";
import { createLoadResult } from "../lib/load-result-observable";
import { notebookService } from "../services/notebook-service";
import { isNoteWithDates, NotebookSortType, NoteId, sortNotes } from "./notebook-model";

export const [sortTypeSignal$, changeSortType] = createSignal<NotebookSortType>();

export const [useSortType, sortTypeWithDefault$] = bind(sortTypeSignal$, "ByDateDesc");

export const [useNotesCollection] = bind(
  combineLatest([sortTypeWithDefault$, notebookService.getNotesCollection()]).pipe(
    map(([sortType, notes]) => sortNotes(sortType, notes).filter(isNoteWithDates))
  )
);

const [changeSelectedNoteSignal$, changeSelectedNote] = createSignal<
  NoteId | undefined
>();

const noteDeepLink$ = location$.pipe(
  map(({ pathname }) => pathname.match(/^\/notebook\/(.+)\/?$/)?.[1])
);

const userNoteSelection$ = changeSelectedNoteSignal$.pipe(
  tap((noteId) => {
    if (noteId) {
      globalHistory.push(`/notebook/${noteId ?? ""}`);
    } else {
      globalHistory.replace(`/notebook`);
    }
  })
);

export const [useSelectedNoteId] = bind(
  merge(noteDeepLink$, userNoteSelection$).pipe(
    distinctUntilChanged(),
    startWith(undefined)
  )
);

export const [createNoteSignal$, createNote] = createSignal<void>();

export const [useCreateNoteResult] = bind(
  createLoadResult(createNoteSignal$, notebookService.createNote)
);

export const [deleteNoteSignal$, deleteNote] = createSignal<NoteId>();

export const [useDeleteNoteResult, deleteNoteResult$] = bind(
  createLoadResult(deleteNoteSignal$, notebookService.deleteNote)
);

export const openNote = (noteId: NoteId) => changeSelectedNote(noteId);

export const closeNote = () => changeSelectedNote(undefined);
