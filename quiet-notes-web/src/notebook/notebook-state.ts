import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { createLoadResult } from "../lib/load-result-observable";
import { notebookService } from "../services/notebook-service";
import { NoteId } from "./notebook-model";
import { NotebookSortType, sortNotes } from "./notebook-sort";

export const [sortTypeSignal$, changeSortType] = createSignal<NotebookSortType>();
export const [useSortType, sortTypeWithDefault$] = bind(sortTypeSignal$, "ByDateDesc");

export const [useNotesCollection] = bind(
  combineLatest([sortTypeWithDefault$, notebookService.getNotesCollection()]).pipe(
    map(([sortType, notes]) => sortNotes(sortType, notes))
  )
);

export const useSelectedNoteId = () => useParams<{ noteId?: string }>().noteId;

export const useSelectNoteById = () => {
  const history = useHistory();
  return useCallback(
    (noteId: NoteId) => {
      history.push(`/notebook/${noteId}`);
    },
    [history]
  );
};

export const useCloseNote = () => {
  const history = useHistory();
  return useCallback(() => {
    history.push("/notebook");
  }, [history]);
};

export const [createNoteSignal$, createNote] = createSignal<void>();

export const [deleteNoteSignal$, deleteNote] = createSignal<NoteId>();

export const [useDeleteNoteResult] = bind(
  createLoadResult({
    input$: deleteNoteSignal$,
    loadResult: notebookService.deleteNote,
  })
);

export const [useCreateNoteResult] = bind(
  createLoadResult({
    input$: createNoteSignal$,
    loadResult: notebookService.createNote,
  })
);
