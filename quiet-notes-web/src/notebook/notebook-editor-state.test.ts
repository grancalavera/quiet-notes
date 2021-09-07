import { act, renderHook } from "@testing-library/react-hooks";
import {
  useLoadNote,
  useNoteState,
  useReset,
  useMergeConflict,
  useUpdateContent,
} from "./notebook-editor-state";
import { Note } from "./notebook-model";

const note = (content: string = "", _version: number = 0): Note => ({
  author: "",
  id: "",
  title: content,
  content,
  _version,
  _createdAt: new Date(0),
  _updatedAt: new Date(_version),
});

describe("note editor state", () => {
  afterEach(() => {
    const reset = renderHook(() => useReset());

    act(() => {
      reset.result.current();
    });
  });

  it("note should be undefined by default", () => {
    const noteState = renderHook(() => useNoteState());
    expect(noteState.result.current).toBeUndefined();
  });

  it("loading the first note populates the note without conflicts", () => {
    const noteState = renderHook(() => useNoteState());
    const loadNote = renderHook(() => useLoadNote());

    act(() => {
      loadNote.result.current(note());
    });

    expect(noteState.result.current).toEqual(note());
  });

  it("resets should clear the current note", () => {
    const noteState = renderHook(() => useNoteState());
    const loadNote = renderHook(() => useLoadNote());
    const reset = renderHook(() => useReset());

    act(() => {
      loadNote.result.current(note());
    });

    act(() => {
      reset.result.current();
    });

    expect(noteState.result.current).toBeUndefined();
  });

  it("update content for undefined notes is a noop", () => {
    const noteState = renderHook(() => useNoteState());
    const updateContent = renderHook(() => useUpdateContent());

    act(() => {
      updateContent.result.current("hello world");
    });

    expect(noteState.result.current).toBeUndefined();
  });

  it("should update the note's content", () => {
    const noteState = renderHook(() => useNoteState());
    const loadNote = renderHook(() => useLoadNote());
    const updateContent = renderHook(() => useUpdateContent());

    act(() => {
      loadNote.result.current(note());
    });

    act(() => {
      updateContent.result.current("hello world");
    });

    expect(noteState.result.current?.content).toEqual("hello world");
  });

  it("loading the next version of a note with identical content should not cause conflicts", () => {
    const noteState = renderHook(() => useNoteState());
    const loadNote = renderHook(() => useLoadNote());
    const updateContent = renderHook(() => useUpdateContent());
    const mergeConflict = renderHook(() => useMergeConflict());

    act(() => {
      loadNote.result.current(note());
    });

    act(() => {
      updateContent.result.current("hello world");
    });

    act(() => {
      loadNote.result.current(note("hello world", 1));
    });

    expect(noteState.result.current?.content).toEqual("hello world");
    expect(noteState.result.current?._version).toEqual(1);
    expect(mergeConflict.result.current).toBeUndefined();
  });

  it("loading a note that causes a merge conflict should not update the note state", () => {
    const noteState = renderHook(() => useNoteState());
    const loadNote = renderHook(() => useLoadNote());
    const updateContent = renderHook(() => useUpdateContent());
    const mergeConflict = renderHook(() => useMergeConflict());

    act(() => {
      loadNote.result.current(note());
    });

    act(() => {
      updateContent.result.current("hello world");
    });

    act(() => {
      loadNote.result.current(note("goodbye world", 1));
    });

    expect(noteState.result.current?.content).toEqual("hello world");
    expect(noteState.result.current?._version).toEqual(0);
    expect(mergeConflict.result.current).toBeTruthy();
  });
});
