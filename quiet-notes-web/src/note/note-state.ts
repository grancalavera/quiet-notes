import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { filter, merge, Observable, of, switchMap, throwError } from "rxjs";
import {
  catchError,
  distinctUntilKeyChanged,
  map,
  sampleTime,
  scan,
  share,
} from "rxjs/operators";
import { isPermissionDeniedError } from "../app/app-error";
import { clientId } from "../app/app-model";
import { peek } from "../lib/peek";
import { empty, incrementClock, mergeNotes, unWrap, wrap } from "./note-model";
import { Note } from "../notebook/notebook-model";
import { notebookService } from "../services/notebook-service";

const frequency = 2000;

const [noteUpdates$, updateNote] = createSignal<Note>();

const remoteNote$ = (noteId: string) =>
  of(noteId).pipe(
    peek("[enter] remoteNote$", (noteId) => ({ noteId, clientId })),
    filter(Boolean),
    switchMap((id) => notebookService.getNoteById(id)),
    catchError((error) => {
      // Permission denied can be a red herring, which happens when a note is deleted and
      // Firebase returns an opaque error telling the user can't see the requested object,
      // but in reality the object doesn't exit. This error should also be raised when users
      // try to read a note that exist but doesn't belong to them.
      return isPermissionDeniedError(error)
        ? of(undefined)
        : throwError(() => error);
    }),
    map(incrementClock(clientId)),
    peek("[exit] remoteNote$")
  );

const localNote$ = noteUpdates$.pipe(
  peek("[enter] localNote$"),
  distinctUntilKeyChanged("content"),
  map(incrementClock(clientId)),
  share(),
  peek("[exit] note$")
);

const [useNote] = bind(
  (noteId: string): Observable<Note | undefined> =>
    merge(
      localNote$.pipe(map(wrap("Local"))),
      remoteNote$(noteId).pipe(map(wrap("Remote")))
    ).pipe(
      peek("[enter] note$"),
      scan(mergeNotes(clientId), empty),
      map(unWrap),
      peek("[exit] note$")
    )
);

export { updateNote, useNote };

localNote$
  .pipe(
    sampleTime(frequency),
    peek("[enter] saveNote"),
    map(incrementClock(clientId)),
    peek("[exit] saveNote$")
  )
  .subscribe(notebookService.saveNote);
