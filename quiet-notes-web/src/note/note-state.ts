import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import {
  filter,
  merge,
  MonoTypeOperatorFunction,
  of,
  switchMap,
  throwError,
} from "rxjs";
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
import * as crdt from "../crdt/clock";
import { increment } from "../crdt/clock";
import { peek } from "../lib/peek";
import { Note } from "../notebook/notebook-model";
import { notebookService } from "../services/notebook-service";

const frequency = 2000;

const incrementNoteClock = <
  T extends Note | undefined
>(): MonoTypeOperatorFunction<T> =>
  map((note) =>
    note ? { ...note, clock: increment(clientId, note.clock) } : note
  );

const mergeNotes = (previous: Note, next: Note): Note => {
  const clock = crdt.receive(clientId, previous.clock, next.clock);
  const note = crdt.isLessThan(previous.clock, next.clock) ? next : previous;
  return { ...note, clock };
};

const [remoteNoteId$, setOpenNote] = createSignal<string | undefined>();
const [noteUpdates$, updateNote] = createSignal<Note>();

const openNote = (id: string) => setOpenNote(id);

const remoteNote$ = remoteNoteId$.pipe(
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
  incrementNoteClock(),
  share(),
  peek("[exit] remoteNote$")
);

const localNote$ = noteUpdates$.pipe(
  peek("[enter] localNote$"),
  distinctUntilKeyChanged("content"),
  incrementNoteClock(),
  share(),
  peek("[exit] note$")
);

localNote$
  .pipe(
    sampleTime(frequency),
    peek("[enter] saveNote"),
    incrementNoteClock(),
    peek("[exit] saveNote$")
  )
  .subscribe(notebookService.saveNote);

type Envelope = Empty | Filled;
type Filled = Local | Remote | Merged;

interface Empty {
  kind: "Empty";
}

interface Local {
  kind: "Local";
  note: Note;
}

interface Remote {
  kind: "Remote";
  note: Note;
}

interface Merged {
  kind: "Merged";
  note: Note;
}

const empty: Envelope = { kind: "Empty" };

const wrap =
  (kind: Filled["kind"]) =>
  (note: Note | undefined): Envelope =>
    note ? { kind, note } : empty;

const merged = wrap("Merged");

const isEmpty = (candidate: Envelope): candidate is Empty =>
  candidate.kind === "Empty";

const isFilled = (candidate: Envelope): candidate is Filled =>
  ["Local", "Remote", "Merged"].includes(candidate.kind);

const sameOrigin = (a: Envelope, b: Envelope): boolean => a.kind === b.kind;

const unWrap = (envelope: Envelope): Note | undefined =>
  isEmpty(envelope) ? undefined : envelope.note;

const [useNote, note$] = bind(
  merge(
    localNote$.pipe(map(wrap("Local"))),
    remoteNote$.pipe(map(wrap("Remote")))
  ).pipe(
    peek("[enter] note$"),
    scan((previous, next) => {
      if (!sameOrigin(previous, next) && isFilled(previous) && isFilled(next)) {
        const note = mergeNotes(previous.note, next.note);
        return merged(note);
      }

      return next;
    }, empty as Envelope),
    map(unWrap),
    peek("[exit] note$")
  )
);

export { openNote, updateNote, useNote, note$ };
