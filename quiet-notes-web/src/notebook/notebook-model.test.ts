import {
  Note,
  mergeNote,
  MergeNote,
  mergeNoteSuccess,
  mergeNoteConflict,
} from "./notebook-model";

interface Scenario {
  name: string;
  local: Note;
  incoming: Note;
  expected: MergeNote;
}

const note = (content: string, _version: number): Note => ({
  author: "",
  id: "",
  title: content,
  content,
  _version,
  _createdAt: new Date(0),
  _updatedAt: new Date(_version),
});

const scenarios: Scenario[] = [
  {
    name: "sequential incoming note with identical content",
    local: note("x", 0),
    incoming: note("x", 1),
    expected: mergeNoteSuccess({
      note: note("x", 1),
    }),
  },
  {
    name: "non sequential ordered incoming note with identical content",
    local: note("x", 0),
    incoming: note("x", 2),
    expected: mergeNoteSuccess({
      note: note("x", 2),
    }),
  },
  {
    name: "sequential incoming note, different content",
    local: note("x", 0),
    incoming: note("y", 1),
    expected: mergeNoteConflict({
      version: 1,
      local: note("x", 0),
      incoming: note("y", 1),
    }),
  },
  {
    name: "out of order incoming note, identical content",
    local: note("x", 1),
    incoming: note("x", 0),
    expected: mergeNoteSuccess({
      note: note("x", 1),
    }),
  },
  {
    name: "out of order incoming note, different content",
    local: note("x", 1),
    incoming: note("y", 0),
    expected: mergeNoteConflict({
      version: 1,
      local: note("x", 1),
      incoming: note("y", 0),
    }),
  },
  {
    name: "incoming note with same version, different content",
    local: note("x", 1),
    incoming: note("y", 1),
    expected: mergeNoteConflict({
      version: 1,
      local: note("x", 1),
      incoming: note("y", 1),
    }),
  },
];

describe.each(scenarios)("merging note updates", (scenario) => {
  const { name, local, incoming, expected } = scenario;

  // eslint-disable-next-line jest/valid-title
  it(name, () => {
    const actual = mergeNote(local, incoming);
    expect(actual).toEqual(expected);
  });
});
