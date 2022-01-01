import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { combineLatest, concat, Observable, of } from "rxjs";
import {
  debounceTime,
  filter,
  map,
  mergeWith,
  switchMap,
  switchMapTo,
  tap,
} from "rxjs/operators";
import { notebookService } from "../services/notebook-service";
import { Note, NoteId } from "./notebook-model";
import { NotebookSortType, sortNotes } from "./notebook-sort";

export const [sortTypeSignal$, changeSortType] = createSignal<NotebookSortType>();
export const [useSortType, sortTypeWithDefault$] = bind(sortTypeSignal$, "ByDateDesc");

export const [useNotesCollection] = bind(
  combineLatest([sortTypeWithDefault$, notebookService.getNotesCollection()]).pipe(
    map(([sortType, notes]) => sortNotes(sortType, notes))
  )
);

export const useOpenNoteId = () => useParams<{ noteId?: string }>().noteId;

export const useOpenNoteById = () => {
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

export const [noteId$, loadNoteById] = createSignal<NoteId>();
export const [noteContentChanges$, changeNoteContent] = createSignal<string>();

const note$ = noteId$.pipe(switchMap((noteId) => notebookService.getNoteById(noteId)));

const noteContent$ = note$.pipe(
  map(({ content }) => content),
  mergeWith(noteContentChanges$)
);

export const [useIsUpdatingNote] = bind(
  combineLatest([note$, noteContent$]).pipe(
    debounceTime(500),
    filter(([note, contentChange]) => note.content !== contentChange),
    switchMap(([note, content]) => concat(of(true), updateNote(note, content), of(false)))
  ),
  false
);

const updateNote = (note: Note, content: string): Observable<void> =>
  notebookService.updateNote({ ...note, content });

noteContent$.pipe(
  mergeWith(note$),
  tap((noteContent) => console.log("updating:", { noteContent })),
  map(() => false)
);

export const [useNoteContent] = bind(noteContent$);

export const [createNoteSignal$, createNote] = createSignal<void>();

export const [useCreatedNoteId] = bind<string | undefined>(
  createNoteSignal$.pipe(switchMapTo(notebookService.createNote())),
  undefined
);

export const [deleteNoteSignal$, deleteNote] = createSignal<NoteId>();

deleteNoteSignal$
  .pipe(switchMap((noteId) => notebookService.deleteNote(noteId)))
  .subscribe();
