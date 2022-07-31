import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { merge, MonoTypeOperatorFunction, Observable, of } from "rxjs";
import { catchError, debounceTime, distinctUntilKeyChanged, map, scan } from "rxjs/operators";
import { isPermissionDeniedError } from "../app/app-error";
import { clientId } from "../app/app-model";
import * as crdt from "../crdt/clock";
import { increment } from "../crdt/clock";
import { peek, peekEnd, peekStart } from "../lib/peek";
import { Note } from "../notebook/notebook-model";
import { notebookService } from "../services/notebook-service";
import { createMutation$ } from "./mutation-observable";

type NoteEnvelope = LocalNote | RemoteNote | MergedNote | undefined;

interface MergedNote {
  kind: "MergedNote";
  note: Note;
}

interface LocalNote {
  kind: "LocalNote";
  note: Note;
}

interface RemoteNote {
  kind: "RemoteNote";
  note: Note;
}

const remoteNote = (note: Note | undefined): NoteEnvelope =>
  note === undefined ? undefined : { kind: "RemoteNote", note };

const localNote = (note: Note): NoteEnvelope => ({ kind: "LocalNote", note });
const mergedNote = (note: Note): NoteEnvelope => ({ kind: "MergedNote", note });

const [noteUpdates$, updateNote] = createSignal<Note>();
const [saveNote$, saveNote] = createSignal<Note>();
export { saveNote };
export { updateNote };

const incrementNoteClock = <T extends Note | undefined>(): MonoTypeOperatorFunction<T> =>
  map((note) => (note ? { ...note, clock: increment(clientId, note.clock) } : note));

const remoteNote$ = (noteId: string): Observable<NoteEnvelope> =>
  notebookService.getNoteById(noteId).pipe(
    peekStart(`remoteNote$`, (note) => ({ note, clientId })),
    catchError((error) => {
      // Permission denied can be a red herring, which happens when a note is deleted and
      // Firebase returns an opaque error telling the user can't see the requested object,
      // but in reality the object doesn't exit.

      // But this error should also be raised when users try to read a note that exist but
      // doesn't belong to them.
      if (isPermissionDeniedError(error)) {
        return of(undefined);
      } else {
        throw error;
      }
    }),
    // I don't think I need to do this, since this stream is my only source of remote notes,
    // and I can just take any clock that originates from a different node (client) as it
    // comes in here... I think...
    //
    // > Finally, when a message is received, the recipient merges
    // > the vector timestamp in the message with its local timestamp
    // > by taking the element-wise maximum of the two vectors, and
    // > then the recipient increments its own entry.
    //
    // unless I interpret a stream as a node...
    incrementNoteClock(),
    map(remoteNote),
    peekEnd()
  );

const localNote$ = noteUpdates$.pipe(
  peekStart("localNote$"),
  incrementNoteClock(),
  map(localNote),
  peekEnd()
);

interface MergeNotesArgs {
  incoming: Note;
  current: Note;
}
const mergeNotes = ({ incoming, current }: MergeNotesArgs): Note => {
  const clock = crdt.receive(clientId, current.clock, incoming.clock);

  if (crdt.isLessThanOrEqual(incoming.clock, current.clock)) {
    return { ...current, clock };
  } else {
    return { ...incoming, clock };
  }
};

const mergedNotes$ = (noteId: string) =>
  merge(remoteNote$(noteId), localNote$).pipe(
    peekStart("mergedNotes$"),
    scan((previous, current) => {
      if (previous === undefined || current === undefined) {
        return undefined;
      } else if (current.kind === "RemoteNote") {
        const note = mergeNotes({ incoming: current.note, current: previous.note });
        return mergedNote(note);
      } else {
        return current;
      }
    }),
    peekEnd()
  );

export const [useNoteById] = bind(
  (noteId: string): Observable<Note | undefined> =>
    mergedNotes$(noteId).pipe(
      peekStart("useNoteById"),
      map((x) => (x === undefined ? undefined : x.note)),
      peekEnd()
    )
);

export const [useSaveNoteResult] = bind(
  createMutation$(
    saveNote$.pipe(
      debounceTime(1000),
      peekStart("saveNote"),
      distinctUntilKeyChanged("content"),
      peek("save"),
      incrementNoteClock(),
      peekEnd()
    ),
    notebookService.saveNote
  )
);
