import { addCleanup, renderHook } from "@testing-library/react-hooks";
import { FirebaseError } from "firebase/app";
import { useAppState } from "../app/app-state";
import "../env";
import { useNote } from "./notebook-service";
import { useNoteInternal } from "./notebook-service-internal";

jest.mock("../env");

jest.mock("./notebook-service-internal", () => ({
  useNoteInternal: jest.fn(),
}));

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
    useNoteInternal_mock.mockReset();
  });

  addCleanup(() => {
    renderHook(() => useAppState((s) => s.dismissError()));
  });

  test("note errors should be handled automatically", () => {
    useNoteInternal_mock.mockReturnValue([undefined, false, mockError]);
    renderHook(() => useNote(""));
    const { result } = renderHook(() => useAppState((s) => s.errors));
    expect(result.current).toEqual([mockError]);
  });
});
