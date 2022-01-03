import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { combineLatest, Observable } from "rxjs";
import {
  debounceTime,
  filter,
  map,
  mergeWith,
  shareReplay,
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

const note$ = noteId$.pipe(
  switchMap((noteId) => notebookService.getNoteById(noteId)),
  filter(Boolean)
);

const noteContent$ = note$.pipe(
  map(({ content }) => content),
  mergeWith(noteContentChanges$)
);

combineLatest([note$, noteContent$])
  .pipe(
    debounceTime(500),
    filter(([note, contentChange]) => note.content !== contentChange),
    tap(([note, content]) => console.log("update", { note, content })),
    switchMap(([note, content]) => updateNote(note, content))
  )
  .subscribe({
    next: () => console.log("note updated..."),
  });

const updateNote = (note: Note, content: string): Observable<void> =>
  notebookService.updateNote({ ...note, content });

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
