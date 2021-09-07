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
    const reset = renderHook(() => useReset());

    act(() => {
      reset.result.current();
    });
  });

  it("note should be undefined by default", () => {
    const note = renderHook(() => useNoteState());
    expect(note.result.current).toBeUndefined();
  });

  it("loading the first note populates the note without conflicts", () => {
    const note = renderHook(() => useNoteState());
    const loadNote = renderHook(() => useLoadNote());

    act(() => {
      loadNote.result.current(emptyNote);
    });

    expect(note.result.current).toEqual(emptyNote);
  });

  it("resets should clear the current note", () => {
    const note = renderHook(() => useNoteState());
    const loadNote = renderHook(() => useLoadNote());
    const reset = renderHook(() => useReset());

    act(() => {
      loadNote.result.current(emptyNote);
    });

    act(() => {
      reset.result.current();
    });

    expect(note.result.current).toBeUndefined();
  });

  it("update content for undefined notes is a noop", () => {
    const note = renderHook(() => useNoteState());
    const updateContent = renderHook(() => useUpdateContent());

    act(() => {
      updateContent.result.current("hello world");
    });

    expect(note.result.current).toBeUndefined();
  });

  it("should update the note's content", () => {
    const note = renderHook(() => useNoteState());
    const loadNote = renderHook(() => useLoadNote());
    const updateContent = renderHook(() => useUpdateContent());

    act(() => {
      loadNote.result.current(emptyNote);
    });

    act(() => {
      updateContent.result.current("hello world");
    });

    expect(note.result.current?.content).toEqual("hello world");
  });
});
