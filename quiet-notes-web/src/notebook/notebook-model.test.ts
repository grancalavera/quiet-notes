import { Note, resolveNoteUpdate, UpdateNoteResult } from "./notebook-model";

interface Scenario {
  name: string;
  local: Note;
  incoming: Note;
  expected: UpdateNoteResult;
}

const note = (content: string, _version: number): Note => ({
  author: "",
  id: "",
  title: content,
  content,
  _version,
});

const scenarios: Scenario[] = [
  {
    name: "incoming immediately after creation",
    local: note("x", 0),
    incoming: note("x", 1),
    expected: {
      kind: "UpdatedNote",
      note: note("x", 1),
    },
  },
  {
    name: "local edits, incoming version strictly next",
    local: note("y", 0),
    incoming: note("x", 1),
    expected: {
      kind: "UpdatedNote",
      note: note("y", 1),
    },
  },
  {
    name: "local edits, newer out of order incoming version",
    local: note("y", 0),
    incoming: note("x", 2),
    expected: {
      kind: "UpdatedNoteChoice",
      version: 2,
      local: note("y", 0),
      incoming: note("x", 2),
    },
  },
  {
    name: "local edits, older incoming version (should never happen)",
    local: note("y", 2),
    incoming: note("x", 1),
    expected: {
      kind: "UpdatedNoteChoice",
      version: 2,
      local: note("y", 2),
      incoming: note("x", 1),
    },
  },
  {
    name: "idempotent update: identical local and incoming",
    local: note("x", 1),
    incoming: note("x", 1),
    expected: {
      kind: "UpdatedNote",
      note: note("x", 1),
    },
  },
  {
    name: "concurrency error: same version created more than once, different content",
    local: note("x", 1),
    incoming: note("y", 1),
    expected: {
      kind: "UpdatedNoteChoice",
      version: 1,
      local: note("x", 1),
      incoming: note("y", 1),
    },
  },
];

describe.each(scenarios)("merging note updates", (scenario) => {
  const { name, local, incoming, expected } = scenario;

  // eslint-disable-next-line jest/valid-title
  it(name, () => {
    const actual = resolveNoteUpdate(local, incoming);
    expect(actual).toEqual(expected);
  });
});
