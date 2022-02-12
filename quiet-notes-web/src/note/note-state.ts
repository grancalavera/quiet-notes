import { bind } from "@react-rxjs/core";
import { NEVER } from "rxjs";
import { catchError } from "rxjs/operators";
import { isFirebaseError } from "../app/app-error";
import { closeNote } from "../notebook/notebook-state";
import { notebookService } from "../services/notebook-service";

export const [useNoteById] = bind((noteId: string | undefined) => {
  console.log("getNoteById", { noteId });
  return noteId
    ? notebookService.getNoteById(noteId).pipe(
        catchError((error) => {
          if (isFirebaseError(error) && error.code === "permission-denied") {
            closeNote();
            return NEVER;
          } else {
            throw error;
          }
        })
      )
    : NEVER;
});
