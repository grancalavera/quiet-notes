import { bind } from "@react-rxjs/core";
import { createSignal, mergeWithKey } from "@react-rxjs/utils";
import { produce } from "immer";
import {
  distinctUntilChanged,
  map,
  scan,
  shareReplay,
  startWith,
} from "rxjs/operators";
import { notebookService } from "../firebase/notebook-service";
import { assertNever } from "../lib/assert-never";
import { Observed } from "../lib/observed";
import { peek } from "../lib/peek";
import { useMutation } from "../lib/use-mutation";

export {
  closeAdditionalNote,
  closeDeletedNote,
  closeMainNote,
  openAdditionalNote,
  openMainNote,
  openNote,
  selectEditor,
};

export const useCreateNote = () => useMutation(notebookService.createNote);
export const useDeleteNote = () => useMutation(notebookService.deleteNote);

const [selectedEditorNote$, openNote] = createSignal<string>();
const [mainNote$, openMainNote] = createSignal<string>();
const [closeMainNote$, closeMainNote] = createSignal();
const [additionalNote$, openAdditionalNote] = createSignal<string>();
const [closeAdditionalNote$, closeAdditionalNote] = createSignal();
const [deletedNoteId$, closeDeletedNote] = createSignal<string>();
const [selectedEditor$, selectEditor] = createSignal<EditorKind>();

const signal$ = mergeWithKey({
  selectedEditorNote$,
  mainNote$,
  additionalNote$,
  closeMainNote$,
  closeAdditionalNote$,
  deletedNoteId$,
  selectedEditor$,
});

type Signal = Observed<typeof signal$>;
export type EditorKind = "main" | "additional";
type EditorState = { noteId: string | undefined };
type EditorGroupState = { [K in EditorKind]: EditorState };
type WithSelectedEditor = { selectedEditor: EditorKind };
type NotebookState = EditorGroupState & WithSelectedEditor;

const defaultNotebookState: NotebookState = {
  selectedEditor: "main",
  main: { noteId: undefined },
  additional: { noteId: undefined },
};

const reduceNotebookState = (state: NotebookState, signal: Signal) =>
  produce(state, (draft) => {
    // in the case where the additional note is undefined this is
    // effectively a no-op, otherwise it'll move the additional note
    // to the main note.
    const closeMainNote = () => {
      draft.main.noteId = draft.additional.noteId;
      draft.additional.noteId = undefined;
      draft.selectedEditor = "main";
    };

    const closeAdditionalNote = () => {
      draft.additional.noteId = undefined;
      draft.selectedEditor = "main";
    };

    switch (signal.type) {
      case "selectedEditorNote$":
        draft[state.selectedEditor].noteId = signal.payload;
        break;
      case "mainNote$":
        draft.main.noteId = signal.payload;
        draft.selectedEditor = "main";
        break;
      case "additionalNote$":
        draft.additional.noteId = signal.payload;
        draft.selectedEditor = "additional";
        break;
      case "closeMainNote$":
        closeMainNote();
        break;
      case "closeAdditionalNote$":
        closeAdditionalNote();
        break;
      case "deletedNoteId$":
        if (
          draft.additional.noteId === draft.main.noteId &&
          draft.main.noteId === signal.payload
        ) {
          return defaultNotebookState;
        }

        if (draft.main.noteId === signal.payload) {
          closeMainNote();
          break;
        }

        if (draft.additional.noteId === signal.payload) {
          closeAdditionalNote();
          break;
        }

        break;
      case "selectedEditor$":
        draft.selectedEditor = signal.payload;
        break;
      default:
        assertNever(signal);
    }
  });

const notebookState$ = signal$.pipe(
  peek("notebookState$ [enter]"),
  scan(reduceNotebookState, defaultNotebookState),
  startWith(defaultNotebookState),
  shareReplay(1),
  peek("notebookState$ [exit]")
);

export const [useNoteIdByEditorKind] = bind((kind: EditorKind) =>
  notebookState$.pipe(map((state) => state[kind].noteId))
);

export const [useAdditionalNoteId] = bind(
  notebookState$.pipe(
    map((state) => state.additional.noteId),
    distinctUntilChanged()
  )
);

export const [useMainNoteId] = bind(
  notebookState$.pipe(
    map((state) => state.main.noteId),
    distinctUntilChanged()
  )
);

export const [useIsNoteOpen] = bind((noteId: string) =>
  notebookState$.pipe(
    map(
      (state) =>
        state.main.noteId === noteId || state.additional.noteId === noteId
    ),
    distinctUntilChanged()
  )
);

export const [useIsSelectedEditor] = bind((kind: EditorKind) =>
  notebookState$.pipe(
    map((state) => state.selectedEditor === kind),
    distinctUntilChanged()
  )
);
