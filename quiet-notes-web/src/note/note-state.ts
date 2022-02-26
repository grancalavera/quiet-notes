import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { merge, Observable, of } from "rxjs";
import { catchError, debounceTime, distinctUntilKeyChanged } from "rxjs/operators";
import { isPermissionDeniedError } from "../app/app-error";
import { peek } from "../lib/peek";
import { Note } from "../notebook/notebook-model";
import { notebookService } from "../services/notebook-service";
import { createMutation$ } from "./mutation-observable";

const [updateNoteSignal$, updateNote] = createSignal<Note>();
export { updateNote };

const createStreamingNote = (noteId: string): Observable<Note | undefined> =>
  notebookService.getNoteById(noteId).pipe(
    peek("getNoteById"),
    catchError((error) => {
      if (isPermissionDeniedError(error)) {
        return of(undefined);
      } else {
        throw error;
      }
    })
  );

export const [useNoteById] = bind(
  (noteId: string): Observable<Note | undefined> =>
    merge(createStreamingNote(noteId), updateNoteSignal$)
);

export const [useUpdateNoteResult] = bind(
  createMutation$(
    updateNoteSignal$.pipe(
      debounceTime(1000),
      distinctUntilKeyChanged("content"),
      peek("updateNote")
    ),
    notebookService.updateNote
  )
);
