import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useParams } from "react-router-dom";
import { combineLatest, merge } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { useMutation } from "../lib/use-mutation";
import { notebookService } from "../services/notebook-service";
import { hasCreatedDate, NotebookSortType, sortNotes } from "./notebook-model";

export const [sortTypeSignal$, changeSortType] =
  createSignal<NotebookSortType>();

export const [useSortType, sortTypeWithDefault$] = bind(
  sortTypeSignal$.pipe(startWith("ByDateDesc" as const))
);

export const [useNotesCollection] = bind(
  combineLatest([
    sortTypeWithDefault$,
    notebookService.getNotesCollection(),
  ]).pipe(
    map(([sortType, notes]) =>
      sortNotes(sortType, notes).filter(hasCreatedDate)
    )
  )
);

export const useSelectedNoteId = () => useParams<{ noteId?: string }>().noteId;
export const useCreateNote = () => useMutation(notebookService.createNote);
export const useDeleteNote = () => useMutation(notebookService.deleteNote);

export const [openNoteInSidebar$, openNoteInSidebar] = createSignal<string>();
export const [closeNoteInSidebar$, closeNoteInSidebar] = createSignal();

export const [useSidebarNote, sidebarNoteId$] = bind(
  merge(openNoteInSidebar$, closeNoteInSidebar$).pipe(startWith(undefined))
);
