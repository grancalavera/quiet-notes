import { act, renderHook } from "@testing-library/react-hooks";
import {
  useLoadNote,
  useMergeConflict,
  useNoteState,
  useReset,
  useResolveConflict,
  useUpdateContent,
} from "./notebook-editor-state";
import { Note } from "./notebook-model";

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
    mockInitialState();

    const noteState = renderHook(() => useNoteState());
    expect(noteState.result.current).toEqual(initialNote);
  });

  it("resets should clear the current note", () => {
    const noteState = renderHook(() => useNoteState());
    const reset = renderHook(() => useReset());

    mockInitialState();

    act(() => {
      reset.result.current();
    });

    expect(noteState.result.current).toBeUndefined();
  });

  it("reset should clear merge conflicts", () => {
    const mergeConflict = renderHook(() => useMergeConflict());
    const reset = renderHook(() => useReset());

    mockLoadTransition(note("hello world", 0), note("goodbye world", 1));
    expect(mergeConflict.result.current).toBeTruthy();

    act(() => {
      reset.result.current();
    });

    expect(mergeConflict.result.current).toBeUndefined();
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
    const updateContent = renderHook(() => useUpdateContent());

    mockInitialState();

    act(() => {
      updateContent.result.current("hello world");
    });

    expect(noteState.result.current?.content).toEqual("hello world");
  });

  it("loading the next version of a note with identical content should not cause conflicts", () => {
    const noteState = renderHook(() => useNoteState());
    const mergeConflict = renderHook(() => useMergeConflict());

    mockLoadTransition(note("hello world", 0), note("hello world", 1));

    expect(noteState.result.current?.content).toEqual("hello world");
    expect(noteState.result.current?._version).toEqual(1);
    expect(mergeConflict.result.current).toBeUndefined();
  });

  it("loading a note that causes a merge conflict should not update the note state", () => {
    const noteState = renderHook(() => useNoteState());
    const mergeConflict = renderHook(() => useMergeConflict());

    mockLoadTransition(note("hello world", 0), note("goodbye world", 1));

    expect(mergeConflict.result.current).toBeTruthy();
    expect(noteState.result.current?.content).toEqual("hello world");
    expect(noteState.result.current?._version).toEqual(0);
  });

  it("resolving an undefined merge conflict is noop", () => {
    const resolveConflict = renderHook(() => useResolveConflict());
    const noteState = renderHook(() => useNoteState());

    mockInitialState();

    act(() => {
      resolveConflict.result.current("local");
    });

    expect(noteState.result.current).toEqual(initialNote);
  });

  it("resolving a merge conflict clears the conflict", () => {
    const mergeConflict = renderHook(() => useMergeConflict());
    const resolveConflict = renderHook(() => useResolveConflict());

    mockLoadTransition(note("hello world", 0), note("goodbye world", 1));

    act(() => {
      resolveConflict.result.current("local");
    });

    expect(mergeConflict.result.current).toBeUndefined();
  });

  it("should resolve a merge conflict choosing the local note", () => {
    const noteState = renderHook(() => useNoteState());
    const resolveConflict = renderHook(() => useResolveConflict());

    mockLoadTransition(note("hello world", 0), note("goodbye world", 1));

    act(() => {
      resolveConflict.result.current("local");
    });

    expect(noteState.result.current?.content).toEqual("hello world");
    expect(noteState.result.current?._version).toEqual(1);
  });

  it("should resolve a merge conflict choosing the incoming note", () => {
    const noteState = renderHook(() => useNoteState());
    const resolveConflict = renderHook(() => useResolveConflict());

    mockLoadTransition(note("hello world", 0), note("goodbye world", 1));

    act(() => {
      resolveConflict.result.current("incoming");
    });

    expect(noteState.result.current?.content).toEqual("goodbye world");
    expect(noteState.result.current?._version).toEqual(1);
  });
});

const note = (content: string, _version: number): Note => ({
  author: "",
  id: "",
  content,
  _version,
  _createdAt: new Date(0),
  _updatedAt: new Date(_version),
});

const mockInitialState = () => {
  const reset = renderHook(() => useReset());
  const loadNote = renderHook(() => useLoadNote());

  act(() => {
    reset.result.current();
    loadNote.result.current(initialNote);
  });
};

const mockLoadTransition = (local: Note, incoming: Note) => {
  const loadNote = renderHook(() => useLoadNote());

  act(() => {
    loadNote.result.current(local);
    loadNote.result.current(incoming);
  });
};

const initialNote = note("", 0);
