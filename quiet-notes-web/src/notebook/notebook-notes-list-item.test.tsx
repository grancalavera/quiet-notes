import { fireEvent, render, prettyDOM } from "@testing-library/react";
import {
  createdAt,
  NotesListItem,
  NotesListItemProps,
  tid,
  updatedAt,
} from "./notebook-notes-list-item";

interface Scenario {
  name: string;
  props: NotesListItemProps;
  expected: {
    ariaCurrent: "true" | "false";
    hasCreatedDate: boolean;
    hasUpdatedDate: boolean;
  };
}

const spyOnSelect = jest.fn();

const _createdAt = new Date(0);
const _updatedAt = new Date(1);
const createdAtWithFormat = createdAt(_createdAt);
const updatedAtWithFormat = updatedAt(_updatedAt);

const zeroOrOne = (x: boolean) => (x ? 1 : 0);
const shouldOrNot = (x: boolean) => (x ? "should" : "should not");

const scenarios: Scenario[] = [
  {
    name: "local newly created note, not selected, no title",
    props: {
      note: { author: "mock", content: "", id: "1", _version: 0 },
      onSelect: spyOnSelect,
      isSelected: false,
    },
    expected: {
      ariaCurrent: "false",
      hasCreatedDate: false,
      hasUpdatedDate: false,
    },
  },
  {
    name: "newly created note, not selected",
    props: {
      note: { author: "mock", content: "", id: "1", _version: 0, _createdAt },
      onSelect: spyOnSelect,
      isSelected: false,
    },
    expected: {
      ariaCurrent: "false",
      hasCreatedDate: true,
      hasUpdatedDate: false,
    },
  },
  {
    name: "newly created note, selected",
    props: {
      note: { author: "mock", content: "", id: "1", _version: 0, _createdAt },
      onSelect: spyOnSelect,
      isSelected: true,
    },
    expected: {
      ariaCurrent: "true",
      hasCreatedDate: true,
      hasUpdatedDate: false,
    },
  },
  {
    name: "updated note",
    props: {
      note: { author: "mock", content: "", id: "1", _version: 0, _createdAt, _updatedAt },
      onSelect: spyOnSelect,
      isSelected: true,
    },
    expected: {
      ariaCurrent: "true",
      hasCreatedDate: true,
      hasUpdatedDate: true,
    },
  },
];

describe.each(scenarios)("<NotesListItem />", (scenario) => {
  const { name, props, expected } = scenario;

  // eslint-disable-next-line jest/valid-title
  describe(name, () => {
    afterEach(() => {
      spyOnSelect.mockClear();
    });

    it("should select a note by id", () => {
      const { getByTestId } = render(<NotesListItem {...props} />);
      fireEvent.click(getByTestId(tid.trigger));
      expect(spyOnSelect).toBeCalledTimes(1);
      expect(spyOnSelect).toBeCalledWith(props.note.id);
    });

    it(`${shouldOrNot(expected.hasCreatedDate)} match formatted created date`, () => {
      const { queryAllByText } = render(<NotesListItem {...props} />);
      const actual = queryAllByText(createdAtWithFormat).length;
      const expectedCount = zeroOrOne(expected.hasCreatedDate);
      expect(actual).toEqual(expectedCount);
    });

    it(`${shouldOrNot(expected.hasUpdatedDate)} match formatted updated date`, () => {
      const { queryAllByText } = render(<NotesListItem {...props} />);
      const actual = queryAllByText(updatedAtWithFormat).length;
      const expectedCount = zeroOrOne(expected.hasUpdatedDate);
      expect(actual).toEqual(expectedCount);
    });

    it(`aria-current should be ${expected.ariaCurrent}`, () => {
      const { getByTestId } = render(<NotesListItem {...props} />);
      const item = getByTestId(tid.component);
      const actual = item.getAttribute("aria-current");
      expect(actual).toEqual(expected.ariaCurrent);
    });
  });
});
