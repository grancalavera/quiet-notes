import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { combineLatest } from "rxjs";
import { map, switchMapTo } from "rxjs/operators";
import * as notebookService from "../notebook-service/notebook-service";
import { NotebookSortType, sortNotes } from "./notebook-sort";

export const useSelectedNoteId = () => useParams<{ noteId?: string }>().noteId;

export const useSelectNote = () => {
  const history = useHistory();
  return useCallback(
    (noteId: string) => {
      history.push(`/notebook/${noteId}`);
    },
    [history]
  );
};

export const useDeselectNote = () => {
  const history = useHistory();
  return useCallback(() => {
    history.push("/notebook");
  }, [history]);
};

export const [sortType$, changeSortType] = createSignal<NotebookSortType>();
export const [useSortType, sortTypeWithDefault$] = bind(sortType$, "ByDateDesc");
export const [createNote$, createNote] = createSignal<void>();

export const [useCreatedNoteId] = bind<string | undefined>(
  createNote$.pipe(switchMapTo(notebookService.createNote())),
  undefined
);

export const [useNotesCollection] = bind(
  combineLatest([sortTypeWithDefault$, notebookService.getNotesCollection()]).pipe(
    map(([sortType, notes]) => sortNotes(sortType, notes))
  )
);
