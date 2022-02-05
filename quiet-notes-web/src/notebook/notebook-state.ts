import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { combineLatest, merge } from "rxjs";
import { distinctUntilChanged, map, startWith, tap } from "rxjs/operators";
import { globalHistory, location$ } from "../app/app-history";
import { createLoadResult } from "../lib/load-result-observable";
import { notebookService } from "../services/notebook-service";
import { isDatedNote, NoteId } from "./notebook-model";
import { NotebookSortType, sortNotes } from "./notebook-sort";

export const [sortTypeSignal$, changeSortType] = createSignal<NotebookSortType>();
export const [useSortType, sortTypeWithDefault$] = bind(sortTypeSignal$, "ByDateDesc");

export const [useNotesCollection] = bind(
  combineLatest([sortTypeWithDefault$, notebookService.getNotesCollection()]).pipe(
    map(([sortType, notes]) => sortNotes(sortType, notes).filter(isDatedNote))
  )
);

export const useSelectNoteById = () => {
  const history = useHistory();
  return useCallback((noteId: NoteId) => history.push(`/notebook/${noteId}`), [history]);
};

export const useCloseNote = () => {
  const history = useHistory();
  return useCallback(() => history.push("/notebook"), [history]);
};

const [changeSelectedNoteSignal$, changeSelectedNote] = createSignal<
  string | undefined
>();

const noteFromDeepLink$ = location$.pipe(
  map(({ pathname }) => pathname.match(/^\/notebook\/(.+)\/?$/)?.[1])
);

const noteFromUserSelection$ = changeSelectedNoteSignal$.pipe(
  tap((noteId) => globalHistory.push(`/notebook/${noteId ?? ""}`))
);

export const [useSelectedNoteId] = bind(
  merge(noteFromDeepLink$, noteFromUserSelection$).pipe(
    distinctUntilChanged(),
    startWith(undefined)
  )
);

const [createNoteSignal$, createNote] = createSignal<void>();
export const [useCreateNoteResult] = bind(
  createLoadResult(createNoteSignal$, notebookService.createNote)
);

const [deleteNoteSignal$, deleteNote] = createSignal<NoteId>();
export const [useDeleteNoteResult] = bind(
  createLoadResult(deleteNoteSignal$, notebookService.deleteNote)
);

export const openNote = (noteId: string) => changeSelectedNote(noteId);
export const closeNote = () => changeSelectedNote(undefined);
export { createNote, deleteNote };
