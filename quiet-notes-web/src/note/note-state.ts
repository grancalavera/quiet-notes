import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { filter, merge, MonoTypeOperatorFunction, of, switchMap, throwError } from "rxjs";
import { catchError, distinctUntilKeyChanged, map, sampleTime, scan, share } from "rxjs/operators";
import { isPermissionDeniedError } from "../app/app-error";
import { clientId } from "../app/app-model";
import * as crdt from "../crdt/clock";
import { increment } from "../crdt/clock";
import { peek } from "../lib/peek";
import { Note } from "../notebook/notebook-model";
import { notebookService } from "../services/notebook-service";

const frequency = 2000;

const incrementNoteClock = <T extends Note | undefined>(): MonoTypeOperatorFunction<T> =>
  map((note) => (note ? { ...note, clock: increment(clientId, note.clock) } : note));

const mergeNotes = (previous: Note, next: Note): Note => {
  const clock = crdt.receive(clientId, previous.clock, next.clock);
  const note = crdt.isLessThan(previous.clock, next.clock) ? next : previous;
  return { ...note, clock };
};

const [remoteNoteId$, setOpenNote] = createSignal<string | undefined>();
const [noteUpdates$, updateNote] = createSignal<Note>();

const openNote = (id: string) => setOpenNote(id);

const remoteNote$ = remoteNoteId$.pipe(
  peek("[enter] unsafe_remoteNote$", (noteId) => ({ noteId, clientId })),
  filter(Boolean),
  switchMap((id) => notebookService.getNoteById(id)),
  catchError((error) => {
    // Permission denied can be a red herring, which happens when a note is deleted and
    // Firebase returns an opaque error telling the user can't see the requested object,
    // but in reality the object doesn't exit. This error should also be raised when users
    // try to read a note that exist but doesn't belong to them.
    return isPermissionDeniedError(error) ? of(undefined) : throwError(() => error);
  }),
  incrementNoteClock(),
  peek("[exit] unsafe_remoteNote$")
);

const localNote$ = noteUpdates$.pipe(
  peek("[enter] localNote$"),
  distinctUntilKeyChanged("content"),
  incrementNoteClock(),
  // it does matter because we'll save on a "sink", which will be
  // another subscription, and we want the source observable to be
  // the same.
  share(),
  peek("[exit] note$")
);

const [useNote, note$] = bind(
  merge(remoteNote$, localNote$).pipe(
    peek("[enter] note$"),
    scan((previous, next) => (previous && next ? mergeNotes(previous, next) : undefined)),
    peek("[exit] note$")
  )
);

localNote$
  .pipe(
    sampleTime(frequency),
    peek("[enter] saveNote"),
    incrementNoteClock(),
    peek("[exit] saveNote$")
  )
  .subscribe(notebookService.saveNote);

export { openNote, updateNote, useNote, note$ };
