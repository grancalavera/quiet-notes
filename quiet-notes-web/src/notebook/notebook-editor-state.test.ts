import { act, renderHook } from "@testing-library/react-hooks";
import {
  useLoadNote,
  useNoteState,
  useReset,
  useUpdateContent,
} from "./notebook-editor-state";
import { Note } from "./notebook-model";

const emptyNote: Note = {
  author: "",
  id: "",
  content: "",
  title: "",
  _version: 0,
};

describe("note editor state", () => {
  afterEach(() => {
    const renderedReset = renderHook(() => useReset());

    act(() => {
      renderedReset.result.current();
    });
  });

  it("note should be undefined by default", () => {
    const renderedNote = renderHook(() => useNoteState());
    expect(renderedNote.result.current).toBeUndefined();
  });

  it("loading the first note populates the note without conflicts", () => {
    const renderedNote = renderHook(() => useNoteState());
    const renderedLoadNote = renderHook(() => useLoadNote());

    act(() => {
      renderedLoadNote.result.current(emptyNote);
    });

    expect(renderedNote.result.current).toEqual(emptyNote);
  });

  it("resets should clear the current note", () => {
    const renderedNote = renderHook(() => useNoteState());
    const renderedLoadNote = renderHook(() => useLoadNote());
    const renderedReset = renderHook(() => useReset());

    act(() => {
      renderedLoadNote.result.current(emptyNote);
    });

    act(() => {
      renderedReset.result.current();
    });

    expect(renderedNote.result.current).toBeUndefined();
  });

  it("update content for undefined notes is a noop", () => {
    const renderedNote = renderHook(() => useNoteState());
    const renderedUpdateContent = renderHook(() => useUpdateContent());

    act(() => {
      renderedUpdateContent.result.current("hello world");
    });

    expect(renderedNote.result.current).toBeUndefined();
  });

  it("should update the note's content", () => {
    const renderedNote = renderHook(() => useNoteState());
    const renderedLoadNote = renderHook(() => useLoadNote());
    const renderedUpdateContent = renderHook(() => useUpdateContent());

    act(() => {
      renderedLoadNote.result.current(emptyNote);
    });

    act(() => {
      renderedUpdateContent.result.current("hello world");
    });

    expect(renderedNote.result.current?.content).toEqual("hello world");
  });
});
