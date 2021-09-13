import { fireEvent, render, screen } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { useUser } from "../app/app-state";
import { useNotesCollectionInternal } from "../notebook-service/notebook-service-internal";
import { Note } from "./notebook-model";
import { NotesList, testId } from "./notebook-notes-list";
import { testId as itemTestId } from "./notebook-notes-list-item";
import { useDeselectNote, useSelectNote } from "./notebook-state";
import { Route, Router, useHistory } from "react-router-dom";
import { createMemoryHistory } from "history";

const history = createMemoryHistory();

jest.mock("../notebook-service/notebook-service-internal", () => ({
  useNotesCollectionInternal: jest.fn(),
  useNoteInternal: jest.fn(),
}));

jest.mock("../app/app-state", () => {
  const appState = jest.requireActual("../app/app-state");
  return { ...appState, useUser: jest.fn() };
});

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return { ...actual, useHistory: jest.fn() };
});

const useNotesCollectionInternal_mock = useNotesCollectionInternal as jest.MockedFunction<
  typeof useNotesCollectionInternal
>;

const useUser_mock = useUser as jest.MockedFunction<typeof useUser>;

const useHistory_mock = useHistory as jest.MockedFunction<typeof useHistory>;

beforeEach(() => useHistory_mock.mockReturnValue(history));

describe("<NotesList />", () => {
  describe("defaults and basic loading", () => {
    test("should render", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([undefined, true, undefined]);

      renderNotesList();

      const actual = screen.getByTestId(testId);
      expect(actual).toBeTruthy();
    });

    test("should show spinner when loading", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([undefined, true, undefined]);

      renderNotesList();

      const actual = screen.getByTestId(testId).querySelector(".bp3-spinner");
      expect(actual).toBeTruthy();
    });

    test("should show non ideal state when not loading and undefined notes", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([undefined, false, undefined]);

      renderNotesList();

      const actual = screen.getByTestId(testId).querySelector(".bp3-non-ideal-state");
      expect(actual).toBeTruthy();
    });

    test("should show non ideal state when not loading and empty notes array", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([[], false, undefined]);

      renderNotesList();

      const actual = screen.getByTestId(testId).querySelector(".bp3-non-ideal-state");
      expect(actual).toBeTruthy();
    });
  });

  describe("working with items in lists", () => {
    const notes: Note[] = [
      { author: "", id: "1", content: "", _version: 1 },
      { author: "", id: "2", content: "", _version: 1 },
      { author: "", id: "3", content: "", _version: 1 },
    ];

    it("should show a list of notes", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);

      renderNotesList();

      const actual = screen.getAllByTestId(itemTestId).length;

      expect(actual).toEqual(notes.length);
    });

    it("should select the first item in the list on click", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);

      renderNotesList();

      const [item] = screen.getAllByTestId(itemTestId);
      fireEvent.click(item);
      const actual = item.classList.contains("bp3-intent-primary");

      expect(actual).toBeTruthy();
    });

    it("should select and deselect items on the list imperatively", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);

      renderNotesList();
      const selectNote = renderHook(() => useSelectNote());
      const deselectNote = renderHook(() => useDeselectNote());

      act(() => selectNote.result.current("1"));
      const [item] = screen.getAllByTestId(itemTestId);
      const actualSelected = item.classList.contains("bp3-intent-primary");
      expect(actualSelected).toBeTruthy();

      act(() => deselectNote.result.current());
      const items = screen.getAllByTestId(itemTestId);
      const actualDeselected = items.every(
        (item) => !item.classList.contains("bp3-intent-primary")
      );
      expect(actualDeselected).toBe(true);
    });

    it("should change the selected note on click", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);
      renderNotesList();

      const items = screen.getAllByTestId(itemTestId);

      const actual = () =>
        items.map((candidate) => candidate.classList.contains("bp3-intent-primary"));

      fireEvent.click(items[0]);
      expect(actual()).toEqual([true, false, false]);

      fireEvent.click(items[1]);
      expect(actual()).toEqual([false, true, false]);

      fireEvent.click(items[2]);
      expect(actual()).toEqual([false, false, true]);
    });
  });
});

const renderNotesList = () => {
  act(() => history.replace("/notebook"));

  return render(
    <Router history={history}>
      <Route path="/notebook/:noteId?">
        <NotesList />
      </Route>
    </Router>
  );
};
