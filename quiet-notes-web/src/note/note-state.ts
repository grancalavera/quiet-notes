import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { merge, Observable, of } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { isPermissionDeniedError } from "../app/app-error";
import { peek } from "../lib/peek";
import { Note } from "../notebook/notebook-model";
import { notebookService } from "../services/notebook-service";

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

export const [useNote] = bind<[noteId: string], Note | undefined>((noteId: string) =>
  merge(createStreamingNote(noteId), updateNoteSignal$.pipe(filter((note) => note.id === noteId)))
);
