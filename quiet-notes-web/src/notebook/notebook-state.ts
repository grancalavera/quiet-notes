import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { combineLatest, EMPTY, of } from "rxjs";
import {
  catchError,
  debounceTime,
  filter,
  map,
  share,
  startWith,
  switchMap,
  switchMapTo,
} from "rxjs/operators";
import { isFirebaseError } from "../app/app-error";
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

const [noteId$, setNoteId] = createSignal<NoteId | undefined>();
export { setNoteId };
export { setNoteContent };
export { useNote };

const [noteContent$, setNoteContent] = createSignal<string>();

const remoteNote$ = noteId$.pipe(
  filter(Boolean),
  switchMap((noteId) => notebookService.getNoteById(noteId)),
  catchError((error) => {
    if (isFirebaseError(error) && error.code === "permission-denied") {
      // handle error
      return EMPTY;
    } else {
      throw error;
    }
  })
);

const [useNote, localNote$] = bind(
  remoteNote$.pipe(
    switchMap((note) =>
      combineLatest([of(note), noteContent$.pipe(startWith(note.content))])
    ),
    map(([note, content]) => ({ ...note, content }))
  )
);

export const [useUpdateNoteWitness] = bind<void>(
  combineLatest([remoteNote$, localNote$]).pipe(
    debounceTime(500),
    filter(
      ([remoteNote, localNote]) =>
        remoteNote && localNote && remoteNote.content !== localNote.content
    ),
    map(([, note]) => note),
    switchMap(notebookService.updateNote),
    startWith(undefined)
  )
);

export const [createNoteSignal$, createNote] = createSignal<void>();

export const [useCreatedNoteId] = bind<string | undefined>(
  createNoteSignal$.pipe(switchMapTo(notebookService.createNote())),
  undefined
);

export const [deleteNoteSignal$, deleteNote] = createSignal<NoteId>();

deleteNoteSignal$
  .pipe(
    switchMap((noteId) => notebookService.deleteNote(noteId)),
    share()
  )
  .subscribe();
