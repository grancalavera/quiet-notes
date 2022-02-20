import { bind } from "@react-rxjs/core";
import { EMPTY, NEVER } from "rxjs";
import { catchError, distinctUntilChanged } from "rxjs/operators";
import { isFirebaseError } from "../app/app-error";
import { Note } from "../notebook/notebook-model";
import { deselectNote } from "../notebook/notebook-state";
import { notebookService } from "../services/notebook-service";

export const [useNoteById] = bind((noteId: string | undefined) => {
  return noteId
    ? notebookService.getNoteById(noteId).pipe(
        catchError((error) => {
          if (isFirebaseError(error) && error.code === "permission-denied") {
            deselectNote();
            return EMPTY;
          } else {
            throw error;
          }
        }),
        distinctUntilChanged(isSameNoteAndVersion)
      )
    : NEVER;
});

const isSameNoteAndVersion = (left: Note, right: Note): boolean =>
  left.id === right.id && left._version === right._version;
