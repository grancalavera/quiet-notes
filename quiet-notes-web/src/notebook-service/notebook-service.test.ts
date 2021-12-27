import { addCleanup, renderHook } from "@testing-library/react-hooks";
import { FirebaseError } from "firebase/app";
import { useAppState } from "../app/app-state";
import { Note } from "../notebook/notebook-model";
import { useNote, useNotesCollection } from "./notebook-service";
import { useNoteInternal, useNotesCollectionInternal } from "./notebook-service-internal";
import "../env";

jest.mock("../env");

jest.mock("./notebook-service-internal", () => ({
  useNotesCollectionInternal: jest.fn(),
  useNoteInternal: jest.fn(),
}));

const useNotesCollectionInternal_mock = useNotesCollectionInternal as jest.MockedFunction<
  typeof useNotesCollectionInternal
>;

const useNoteInternal_mock = useNoteInternal as jest.MockedFunction<
  typeof useNoteInternal
>;

const mockError: FirebaseError = {
  code: "mock error code",
  message: "mock error message",
  name: "FirebaseError",
};

describe("global error handling", () => {
  afterEach(() => {
    useNotesCollectionInternal_mock.mockReset();
    useNoteInternal_mock.mockReset();
  });

  addCleanup(() => {
    renderHook(() => useAppState((s) => s.dismissError()));
  });

  test("notes collection errors should be handled automatically", () => {
    useNotesCollectionInternal_mock.mockReturnValue([undefined, false, mockError]);
    renderHook(() => useNotesCollection(""));
    const { result } = renderHook(() => useAppState((s) => s.errors));
    expect(result.current).toEqual([mockError]);
  });

  test("note errors should be handled automatically", () => {
    useNoteInternal_mock.mockReturnValue([undefined, false, mockError]);
    renderHook(() => useNote(""));
    const { result } = renderHook(() => useAppState((s) => s.errors));
    expect(result.current).toEqual([mockError]);
  });

  test("mock empty notes collections", () => {
    useNotesCollectionInternal_mock.mockReturnValue([[] as any, false, undefined]);
    const { result } = renderHook(() => useNotesCollection(""));
    const [actual] = result.current;
    expect(actual).toEqual([]);
  });

  test("mock notes collections", () => {
    const notes: Note[] = [
      {
        author: "",
        content: "",
        id: "",
        _version: 0,
        _createdAt: new Date(0),
        _updatedAt: new Date(0),
      },
    ];
    useNotesCollectionInternal_mock.mockReturnValue([notes as any, false, undefined]);
    const { result } = renderHook(() => useNotesCollection(""));
    const [actual] = result.current;
    expect(actual).toEqual(notes);
  });
});
