import { state } from "@react-rxjs/core";
import { mergeWithKey } from "@react-rxjs/utils";
import { produce } from "immer";
import {
  distinctUntilChanged,
  filter,
  map,
  scan,
  shareReplay,
  startWith,
} from "rxjs/operators";
import { notebookService } from "../firebase/notebook-service";
import { assertNever } from "../lib/assert-never";
import { Observed } from "../lib/observed";
import { peek } from "../lib/peek";
import { bindRelation, createRelatedSignal } from "../lib/relation";
import { useMutation } from "../lib/use-mutation";

export {
  useCloseAdditionalNote,
  useCloseDeletedNote,
  useCloseMainNote,
  useOpenAdditionalNote,
  useOpenMainNote,
  useOpenNote,
  useSelectEditor,
};

export const useCreateNote = () => useMutation(notebookService.createNote);
export const useDeleteNote = () => useMutation(notebookService.deleteNote);

const [selectedEditorNote$, useOpenNote] = createRelatedSignal<string>();
const [mainNote$, useOpenMainNote] = createRelatedSignal<string>();
const [closeMainNote$, useCloseMainNote] = createRelatedSignal();
const [additionalNote$, useOpenAdditionalNote] = createRelatedSignal<string>();
const [closeAdditionalNote$, useCloseAdditionalNote] = createRelatedSignal();
const [deletedNoteId$, useCloseDeletedNote] = createRelatedSignal<string>();
const [selectedEditor$, useSelectEditor] = createRelatedSignal<EditorKind>();

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
        draft[state.selectedEditor].noteId = signal.payload.value;
        break;
      case "mainNote$":
        draft.main.noteId = signal.payload.value;
        draft.selectedEditor = "main";
        break;
      case "additionalNote$":
        draft.additional.noteId = signal.payload.value;
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
          draft.main.noteId === signal.payload.value
        ) {
          return defaultNotebookState;
        }

        if (draft.main.noteId === signal.payload.value) {
          closeMainNote();
          break;
        }

        if (draft.additional.noteId === signal.payload.value) {
          closeAdditionalNote();
          break;
        }

        break;
      case "selectedEditor$":
        draft.selectedEditor = signal.payload.value;
        break;
      default:
        assertNever(signal);
    }
  });

const notebookState$ = state((relation: string) =>
  signal$.pipe(
    filter((signal) => signal.payload.context === relation),
    peek("notebookState$ [enter]"),
    scan(reduceNotebookState, defaultNotebookState),
    startWith(defaultNotebookState),
    shareReplay(1),
    peek("notebookState$ [exit]")
  )
);

export const [useNoteIdByEditorKind] = bindRelation(
  (relation: string, kind: EditorKind) =>
    notebookState$(relation).pipe(map((state) => state[kind].noteId))
);

export const [useAdditionalNoteId] = bindRelation((relation: string) =>
  notebookState$(relation).pipe(
    map((state) => state.additional.noteId),
    distinctUntilChanged()
  )
);

export const [useMainNoteId] = bindRelation((relation: string) =>
  notebookState$(relation).pipe(
    map((state) => state.main.noteId),
    distinctUntilChanged()
  )
);

export const [useIsNoteOpen] = bindRelation(
  (relation: string, noteId: string) =>
    notebookState$(relation).pipe(
      map(
        (state) =>
          state.main.noteId === noteId || state.additional.noteId === noteId
      ),
      distinctUntilChanged()
    )
);

export const [useIsSelectedEditor] = bindRelation(
  (relation: string, kind: EditorKind) =>
    notebookState$(relation).pipe(
      map((state) => state.selectedEditor === kind),
      distinctUntilChanged()
    )
);
