import { bind } from "@react-rxjs/core";
import { createSignal } from "@react-rxjs/utils";
import { History } from "history";
import { useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { combineLatest, of } from "rxjs";
import { map, switchMap, switchMapTo, tap } from "rxjs/operators";
import { user$ } from "../auth/user-streams";
import { firebaseApp$ } from "../firebase/firebase-initialize";
import { createNoteInternal } from "../notebook-service/notebook-service";
import { deriveTitle, Note } from "./notebook-model";

export type NotebookSortType = "ByTitleAsc" | "ByTitleDesc" | "ByDateAsc" | "ByDateDesc";

const sortNotes = (sortType: NotebookSortType, [...notes]: Note[]): Note[] =>
  notes.sort(sort[sortType]);

const sort: Record<NotebookSortType, (a: Note, b: Note) => number> = {
  ByDateAsc: (a, b) => {
    const da = a._createdAt?.getTime() ?? 0;
    const db = b._createdAt?.getTime() ?? 0;
    return da - db;
  },
  ByDateDesc: (a, b) => {
    const da = a._createdAt?.getTime() ?? 0;
    const db = b._createdAt?.getTime() ?? 0;
    return db - da;
  },
  ByTitleAsc: (a, b) => {
    const ta = deriveTitle(a);
    const tb = deriveTitle(b);
    return ta < tb ? -1 : tb < ta ? 1 : 0;
  },
  ByTitleDesc: (a, b) => {
    const ta = deriveTitle(a);
    const tb = deriveTitle(b);
    return ta < tb ? 1 : tb < ta ? -1 : 0;
  },
};

export const useSelectedNoteId = () => useParams<{ noteId?: string }>().noteId;

export const useDeselectNote = () => {
  const history = useHistory();

  return useCallback(() => {
    history.push("/notebook");
  }, [history]);
};

export const [sortType$, changeSortType] = createSignal<NotebookSortType>();

export const [useSortType, sortTypeWithDefault$] = bind(sortType$, "ByDateDesc");

export const [notes$, loadNotes] = createSignal<Note[]>();

export const [useNotes] = bind(
  combineLatest([sortTypeWithDefault$, notes$]).pipe(
    map(([sortType, notes]) => sortNotes(sortType, notes))
  ),
  []
);

export const [createNote$, createNote] = createSignal<void>();

export const [useCreatedNoteId] = bind<string | undefined>(
  createNote$.pipe(
    switchMapTo(combineLatest([firebaseApp$, user$])),
    switchMap(([app, user]) => createNoteInternal(app)(user.uid))
  ),
  undefined
);

export const useSelectNote = () => {
  const history = useHistory();

  return useCallback(
    (noteId: string) => {
      history.push(`/notebook/${noteId}`);
    },
    [history]
  );
};
