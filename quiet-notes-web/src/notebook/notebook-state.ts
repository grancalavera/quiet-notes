import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { combineLatest, Observable, of } from "rxjs";
import { map, mergeWith, switchMap, switchMapTo } from "rxjs/operators";
import { notebookService } from "../notebook-service/notebook-service";
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
export const [noteContent$, changeNoteContent] = createSignal<string>();

const note$: Observable<Note> = noteId$.pipe(
  switchMap((noteId) => notebookService.getNoteById(noteId)),
  switchMap((note) =>
    combineLatest([of(note), of(note.content).pipe(mergeWith(noteContent$))])
  ),
  map(([note, content]) => ({ ...note, content }))
);

export const [useNote] = bind<Note>(note$);

export const [createNoteSignal$, createNote] = createSignal<void>();

export const [useCreatedNoteId] = bind<string | undefined>(
  createNoteSignal$.pipe(switchMapTo(notebookService.createNote())),
  undefined
);

export const [deleteNoteSignal$, deleteNote] = createSignal<NoteId>();

deleteNoteSignal$
  .pipe(switchMap((noteId) => notebookService.deleteNote(noteId)))
  .subscribe();
