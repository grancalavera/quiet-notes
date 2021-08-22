import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useUser } from "../app/app-state";
import { useNotesCollectionInternal } from "../notebook-service/notebook-service-internal";
import { Note } from "./notebook-model";
import { NotesList } from "./notebook-notes-list";
import { testId } from "./notebook-notes-list";
import { testId as itemTestId } from "./notebook-notes-list-item";

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
  test("ensure user mock works", () => {
    const expected = "mock-user";
    useUser_mock.mockReturnValue({ uid: expected } as any);
    const { result } = renderHook(() => useUser());
    const actual = result.current.uid;
    expect(actual).toEqual(actual);
  });

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

  test("should show a list of notes", () => {
    const notes: Note[] = [
      { author: "", id: "1", content: "", title: "" },
      { author: "", id: "2", content: "", title: "" },
      { author: "", id: "3", content: "", title: "" },
    ];
    useUser_mock.mockReturnValue({ uid: "" } as any);
    useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);
    render(<NotesList />);
    const actual = screen.getAllByTestId(itemTestId).length;
    expect(actual).toEqual(notes.length);
  });
});
