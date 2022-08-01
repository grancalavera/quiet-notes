import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { merge, Observable } from "rxjs";
import { catchError, debounceTime, distinctUntilKeyChanged, map, scan } from "rxjs/operators";
import { isPermissionDeniedError } from "../app/app-error";
import { clientId } from "../app/app-model";
import * as crdt from "../crdt/clock";
import { isNone, none, Option, orUndefined, some } from "../lib/option";
import { mapOption$, ofNone } from "../lib/option-observable";
import { peek, peekEnd, peekStart } from "../lib/peek";
import { Note } from "../notebook/notebook-model";
import { notebookService } from "../services/notebook-service";
import { createMutation$ } from "./mutation-observable";

type NoteEnvelope = Option<LocalNote | RemoteNote | MergedNote>;

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

const remoteNote = (note: Note): NoteEnvelope => some({ kind: "RemoteNote", note });
const localNote = (note: Note): NoteEnvelope => some({ kind: "LocalNote", note });
const mergedNote = (note: Note): NoteEnvelope => some({ kind: "MergedNote", note });

const [noteUpdates$, updateNote] = createSignal<Note>();
const [saveNote$, saveNote] = createSignal<Note>();
export { saveNote };
export { updateNote };

const incrementClock = (note: Note) => ({
  ...note,
  clock: crdt.increment(clientId, note.clock),
});

const remoteNote$ = (noteId: string): Observable<NoteEnvelope> =>
  notebookService.getNoteById(noteId).pipe(
    peekStart(`remoteNote$`, (note) => ({ note, clientId })),
    // I don't think I need to do this, since this stream is my only source of remote notes,
    // and I can just take any clock that originates from a different node (client) as it
    // comes in here... I think...
    //
    // > Finally, when a message is received, the recipient merges
    // > the vector timestamp in the message with its local timestamp
    // > by taking the element-wise maximum of the two vectors, and
    // > then the recipient increments its own entry.
    map((note) => remoteNote(incrementClock(note))),
    catchError((error) => {
      // Permission denied can be a red herring, which happens when a note is deleted and
      // Firebase returns an opaque error telling the user can't see the requested object,
      // but in reality the object doesn't exit.

      // But this error should also be raised when users try to read a note that exist but
      // doesn't belong to them.
      if (isPermissionDeniedError(error)) {
        return ofNone();
      } else {
        throw error;
      }
    }),

    peekEnd()
  );

const localNote$ = noteUpdates$.pipe(
  peekStart("localNote$"),
  map(incrementClock),
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
      if (isNone(previous) || isNone(current)) {
        return none();
      } else if (current.value.kind === "RemoteNote") {
        const note = mergeNotes({
          incoming: current.value.note,
          current: previous.value.note,
        });
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
      mapOption$((x) => x.note),
      map(orUndefined),
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
      map(incrementClock),
      peekEnd()
    ),
    notebookService.saveNote
  )
);
