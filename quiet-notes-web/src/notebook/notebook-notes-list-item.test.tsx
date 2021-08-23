import { fireEvent, render } from "@testing-library/react";
import {
  b,
  createdAt,
  defaultNoteTitle,
  maxTitleLength,
  NotesListItem,
  NotesListItemProps,
  testId,
  updatedAt,
} from "./notebook-notes-list-item";

interface Scenario {
  name: string;
  props: NotesListItemProps;
  expected: {
    title: string;
  };
}

const spyOnSelect = jest.fn();

const _createdAt = new Date(0);
const _updatedAt = new Date(1);
const createdAtWithFormat = createdAt(_createdAt);
const updatedAtWithFormat = updatedAt(_updatedAt);

const mockTitle = (length: number) => [...Array(length)].map(() => "a").join("");
const shortTitle = "a";
const longTitle = mockTitle(maxTitleLength * 2);
const truncatedTitle = mockTitle(maxTitleLength - 3) + "...";
const zeroOrOne = (x: boolean) => (x ? 1 : 0);
const shouldOrNot = (x: boolean) => (x ? "should" : "should not");

const scenarios: Scenario[] = [
  {
    name: "local newly created note, not selected, no title",
    props: {
      note: { author: "mock", content: "", id: "1", title: "" },
      onSelect: spyOnSelect,
      isSelected: false,
    },
    expected: {
      title: defaultNoteTitle,
    },
  },
  {
    name: "newly created note, not selected",
    props: {
      note: { author: "mock", content: "", id: "1", title: "", _createdAt },
      onSelect: spyOnSelect,
      isSelected: false,
    },
    expected: {
      title: defaultNoteTitle,
    },
  },
  {
    name: "newly created note, selected",
    props: {
      note: { author: "mock", content: "", id: "1", title: "", _createdAt },
      onSelect: spyOnSelect,
      isSelected: true,
    },
    expected: {
      title: defaultNoteTitle,
    },
  },
  {
    name: "updated note",
    props: {
      note: { author: "mock", content: "", id: "1", title: "", _createdAt, _updatedAt },
      onSelect: spyOnSelect,
      isSelected: true,
    },
    expected: {
      title: defaultNoteTitle,
    },
  },
  {
    name: "short title",
    props: {
      note: {
        author: "mock",
        content: "",
        id: "1",
        title: shortTitle,
        _createdAt,
        _updatedAt,
      },
      onSelect: spyOnSelect,
      isSelected: true,
    },
    expected: {
      title: shortTitle,
    },
  },
  {
    name: "long title",
    props: {
      note: {
        author: "mock",
        content: "",
        id: "1",
        title: longTitle,
        _createdAt,
        _updatedAt,
      },
      onSelect: spyOnSelect,
      isSelected: true,
    },
    expected: {
      title: truncatedTitle,
    },
  },
];

describe.each(scenarios)("<NotesListItem />", (scenario) => {
  const { name, props } = scenario;

  const expectedTitle = scenario.expected.title;
  const showCreatedDate = !!props.note._createdAt;
  const showUpdatedDate = !!props.note._updatedAt;
  const isSelected = props.isSelected;

  // eslint-disable-next-line jest/valid-title
  describe(name, () => {
    afterEach(() => {
      spyOnSelect.mockClear();
    });

    it("should select a note by id", () => {
      const { getByTestId } = render(<NotesListItem {...props} />);
      fireEvent.click(getByTestId(testId));
      expect(spyOnSelect).toBeCalledTimes(1);
      expect(spyOnSelect).toBeCalledWith(props.note.id);
    });

    it(`${shouldOrNot(showCreatedDate)} match formatted created date`, () => {
      const { queryAllByText } = render(<NotesListItem {...props} />);
      const actual = queryAllByText(createdAtWithFormat).length;
      const expected = zeroOrOne(showCreatedDate);
      expect(actual).toEqual(expected);
    });

    it(`${shouldOrNot(showUpdatedDate)} match formatted updated date`, () => {
      const { queryAllByText } = render(<NotesListItem {...props} />);
      const actual = queryAllByText(updatedAtWithFormat).length;
      const expected = zeroOrOne(showUpdatedDate);
      expect(actual).toEqual(expected);
    });

    it(`should match title:"${expectedTitle}"`, () => {
      const { getByTestId } = render(<NotesListItem {...props} />);
      const actual = getByTestId(testId)?.querySelector(".bp3-heading")?.textContent;
      expect(actual).toEqual(expectedTitle);
    });

    it(`${shouldOrNot(isSelected)} be selected by blueprint`, () => {
      const { getByTestId } = render(<NotesListItem {...props} />);
      const actual = getByTestId(testId).classList.contains("bp3-intent-primary");
      expect(actual).toEqual(isSelected);
    });

    it(`${shouldOrNot(isSelected)} be selected by quiet notes`, () => {
      const { getByTestId } = render(<NotesListItem {...props} />);
      const expectedClasses = b({ isSelected }).toString().split(" ");
      const actualClasses: string[] = [];
      getByTestId(testId).classList.forEach((c) => actualClasses.push(c));
      const actual = expectedClasses.every((className) =>
        actualClasses.includes(className)
      );
      expect(actual).toBeTruthy();
    });
  });
});
