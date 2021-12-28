import { fireEvent, render, screen } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import { Route, Router, useHistory } from "react-router-dom";
import { useUser } from "../auth/user-streams";
import "../env";
import { useNotesCollectionInternal } from "../notebook-service/notebook-service-internal";
import { Note } from "./notebook-model";
import { NotesList, testId } from "./notebook-notes-list";
import { tid as itemTid } from "./notebook-notes-list-item";
import { useDeselectNote, useSelectNote } from "./notebook-state";

const history = createMemoryHistory();

jest.mock("../env");

jest.mock("../notebook-service/notebook-service-internal", () => ({
  useNotesCollectionInternal: jest.fn(),
  useNoteInternal: jest.fn(),
}));

jest.mock("../auth/user", () => {
  const user = jest.requireActual("../auth/user");
  return { ...user, useUser: jest.fn() };
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
    it("should render", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([undefined, true, undefined]);

      renderNotesList();

      const actual = screen.getByTestId(testId);
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

      const actual = screen.getAllByTestId(itemTid.component).length;

      expect(actual).toEqual(notes.length);
    });

    it("should select the first item in the list on click", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);

      renderNotesList();

      const [trigger] = screen.getAllByTestId(itemTid.trigger);
      fireEvent.click(trigger);
      const [item] = screen.getAllByTestId(itemTid.component);
      const actual = item.getAttribute("aria-current");

      expect(actual).toEqual("true");
    });

    it("should select and deselect items on the list imperatively", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);

      renderNotesList();
      const selectNote = renderHook(() => useSelectNote());
      const deselectNote = renderHook(() => useDeselectNote());

      act(() => selectNote.result.current("1"));
      const [item] = screen.getAllByTestId(itemTid.component);
      const actualSelected = item.getAttribute("aria-current");
      expect(actualSelected).toEqual("true");

      act(() => deselectNote.result.current());
      const items = screen.getAllByTestId(itemTid.component);
      const actualDeselected = items.every(
        (item) => item.getAttribute("aria-current") === "false"
      );
      expect(actualDeselected).toBe(true);
    });

    it("should change the selected note on click", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);
      renderNotesList();

      const items = screen.getAllByTestId(itemTid.component);
      const triggers = screen.getAllByTestId(itemTid.trigger);

      const actual = () =>
        items.map((candidate) => candidate.getAttribute("aria-current") === "true");

      fireEvent.click(triggers[0]);
      expect(actual()).toEqual([true, false, false]);

      fireEvent.click(triggers[1]);
      expect(actual()).toEqual([false, true, false]);

      fireEvent.click(triggers[2]);
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
