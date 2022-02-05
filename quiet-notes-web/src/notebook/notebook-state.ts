import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { combineLatest, of } from "rxjs";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { failure, idle, loading, LoadResult, success } from "../lib/load-result";
import { notebookService } from "../services/notebook-service";
import { NoteId } from "./notebook-model";
import { NotebookSortType, sortNotes } from "./notebook-sort";

export const [sortTypeSignal$, changeSortType] = createSignal<NotebookSortType>();
export const [useSortType, sortTypeWithDefault$] = bind(sortTypeSignal$, "ByDateDesc");

export const [useNotesCollection] = bind(
  combineLatest([sortTypeWithDefault$, notebookService.getNotesCollection()]).pipe(
    map(([sortType, notes]) => sortNotes(sortType, notes))
  )
);

export const useSelectedNoteId = () => useParams<{ noteId?: string }>().noteId;

export const useSelectNoteById = () => {
  const history = useHistory();
  return useCallback(
    (noteId: NoteId) => {
      history.push(`/notebook/${noteId}`);
    },
    [history]
  );
};

export const useCloseNote = () => {
  const history = useHistory();
  return useCallback(() => {
    history.push("/notebook");
  }, [history]);
};

export const [createNoteSignal$, createNote] = createSignal<void>();

export const [useCreateNoteResult] = bind<string | undefined>(
  createNoteSignal$.pipe(switchMap(() => notebookService.createNote())),
  undefined
);

export const [deleteNoteSignal$, deleteNote] = createSignal<NoteId>();

export const [useDeleteNoteResult] = bind<LoadResult<void>>(
  deleteNoteSignal$.pipe(
    switchMap((noteId) =>
      notebookService.deleteNote(noteId).pipe(
        catchError((error) => of(failure<void>(error))),
        map(() => success()),
        startWith(loading())
      )
    ),
    startWith(idle())
  )
);
