import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useParams } from "react-router";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { globalHistory } from "../app/app-history";
import { useMutation } from "../lib/use-mutation";
import { notebookService } from "../services/notebook-service";
import { hasCreatedDate, NotebookSortType, NoteId, sortNotes } from "./notebook-model";

export const [sortTypeSignal$, changeSortType] = createSignal<NotebookSortType>();

export const [useSortType, sortTypeWithDefault$] = bind(sortTypeSignal$, "ByDateDesc");

export const [useNotesCollection] = bind(
  combineLatest([sortTypeWithDefault$, notebookService.getNotesCollection()]).pipe(
    map(([sortType, notes]) => sortNotes(sortType, notes).filter(hasCreatedDate))
  )
);

export const selectNote = (noteId: NoteId) => globalHistory.push(`/notebook/${noteId}`);
export const deselectNote = () => globalHistory.push(`/notebook`);
export const useSelectedNoteId = () => useParams<{ noteId?: string }>().noteId;
export const useCreateNote = () => useMutation(notebookService.createNote);
export const useDeleteNote = () => useMutation(notebookService.deleteNote);
