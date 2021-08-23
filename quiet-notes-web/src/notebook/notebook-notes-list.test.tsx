import { fireEvent, render, screen } from "@testing-library/react";
import { act, addCleanup, renderHook } from "@testing-library/react-hooks";
import { useUser } from "../app/app-state";
import { useNotesCollectionInternal } from "../notebook-service/notebook-service-internal";
import { Note } from "./notebook-model";
import { NotesList, testId } from "./notebook-notes-list";
import { testId as itemTestId } from "./notebook-notes-list-item";
import { useNotebookState } from "./notebook-state";

jest.mock("../notebook-service/notebook-service-internal", () => ({
  useNotesCollectionInternal: jest.fn(),
  useNoteInternal: jest.fn(),
}));

jest.mock("../app/app-state", () => {
  const appState = jest.requireActual("../app/app-state");
  return { ...appState, useUser: jest.fn() };
});

const useNotesCollectionInternal_mock = useNotesCollectionInternal as jest.MockedFunction<
  typeof useNotesCollectionInternal
>;

const useUser_mock = useUser as jest.MockedFunction<typeof useUser>;

describe("<NotesList />", () => {
  describe("defaults and basic loading", () => {
    test("should render", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([undefined, true, undefined]);
      render(<NotesList />);
      const actual = screen.getByTestId(testId);
      expect(actual).toBeTruthy();
    });

    test("should show spinner when loading", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([undefined, true, undefined]);
      render(<NotesList />);
      const actual = screen.getByTestId(testId).querySelector(".bp3-spinner");
      expect(actual).toBeTruthy();
    });

    test("should show non ideal state when not loading and undefined notes", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([undefined, false, undefined]);
      render(<NotesList />);
      const actual = screen.getByTestId(testId).querySelector(".bp3-non-ideal-state");
      expect(actual).toBeTruthy();
    });

    test("should show non ideal state when not loading and empty notes array", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([[], false, undefined]);
      render(<NotesList />);
      const actual = screen.getByTestId(testId).querySelector(".bp3-non-ideal-state");
      expect(actual).toBeTruthy();
    });
  });

  describe("working with items in lists", () => {
    const notebookState = renderHook(() => useNotebookState());

    const notes: Note[] = [
      { author: "", id: "1", content: "", title: "" },
      { author: "", id: "2", content: "", title: "" },
      { author: "", id: "3", content: "", title: "" },
    ];

    afterEach(() => {
      act(() => notebookState.result.current.deselectNote());
    });

    it("should show a list of notes", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);

      render(<NotesList />);
      const actual = screen.getAllByTestId(itemTestId).length;

      expect(actual).toEqual(notes.length);
    });

    it("should select the first item in the list on click", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);

      render(<NotesList />);
      const [item] = screen.getAllByTestId(itemTestId);
      fireEvent.click(item);
      const actual = item.classList.contains("bp3-intent-primary");

      expect(actual).toBeTruthy();
    });

    it("should select the first item in the list when state changes", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);

      act(() => {
        notebookState.result.current.selectNote("1");
      });

      render(<NotesList />);
      const [item] = screen.getAllByTestId(itemTestId);
      const actual = item.classList.contains("bp3-intent-primary");

      expect(actual).toBeTruthy();
    });

    it("should change the selected note on click", () => {
      useUser_mock.mockReturnValue({ uid: "" } as any);
      useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);

      render(<NotesList />);
      const [item1, item2, item3] = screen.getAllByTestId(itemTestId);

      const actual = () => [
        item1.classList.contains("bp3-intent-primary"),
        item2.classList.contains("bp3-intent-primary"),
        item3.classList.contains("bp3-intent-primary"),
      ];

      fireEvent.click(item1);
      expect(actual()).toEqual([true, false, false]);

      fireEvent.click(item2);
      expect(actual()).toEqual([false, true, false]);

      fireEvent.click(item3);
      expect(actual()).toEqual([false, false, true]);
    });
  });
});
