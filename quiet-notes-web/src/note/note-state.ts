import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { filter, merge, Observable, of, switchMap, throwError } from "rxjs";
import { catchError, map, sampleTime, scan, share } from "rxjs/operators";
import { isPermissionDeniedError } from "../app/app-error";
import { clientId } from "../app/app-model";
import { peek } from "../lib/peek";
import { Note } from "../notebook/notebook-model";
import { notebookService } from "../firebase/notebook-service";
import { empty, incrementClock, mergeNotes, unWrap, wrap } from "./note-model";

const frequency = 2000;

const [noteUpdates$, updateNote] = createSignal<Note>();

const remoteNote$ = (noteId: string) =>
  of(noteId).pipe(
    peek("[enter] remoteNote$", (noteId) => ({ noteId, clientId })),
    filter(Boolean),
    switchMap((id) => notebookService.getNoteById(id)),
    catchError((error) => {
      // Permission denied can be a red herring, which happens when a note is
      // deleted and Firebase returns an opaque error telling the user can't see
      // the requested object, but in reality the object doesn't exit. This
      // error should also be raised when users try to read a note that exist
      // but doesn't belong to them.

      // This can be happening because we're actually trying to read a note that
      // doesn't belong to us.
      return isPermissionDeniedError(error)
        ? of(undefined)
        : throwError(() => error);
    }),
    map(incrementClock(clientId)),
    peek("[exit] remoteNote$")
  );

const localNote$ = noteUpdates$.pipe(
  peek("[enter] localNote$"),
  map(incrementClock(clientId)),
  share(),
  peek("[exit] localNote$")
);

const [useNote] = bind(
  (noteId: string): Observable<Note | undefined> =>
    merge(
      localNote$.pipe(
        filter((candidate) => candidate.id === noteId),
        map(wrap("Local"))
      ),
      remoteNote$(noteId).pipe(map(wrap("Remote")))
    ).pipe(
      peek("[enter] note$"),
      scan(mergeNotes(clientId), empty),
      map(unWrap),
      peek("[exit] note$")
    )
);

localNote$
  .pipe(
    sampleTime(frequency),
    peek("[enter] saveNote"),
    map(incrementClock(clientId)),
    peek("[exit] saveNote$")
  )
  .subscribe(notebookService.saveNote);

export { updateNote, useNote };
