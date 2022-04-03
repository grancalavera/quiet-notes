import {
  clockOrderDeclarative,
  clockOrderImperative,
  IsClockOrder,
  clockOrderImperativeInlined,
  clockOrderImperativeForEach,
  clockOrderZ,
} from "./clock";

interface Scenario {
  name: string;
  compare: IsClockOrder;
}

const scenarios: Scenario[] = [
  { name: "declarative", compare: clockOrderDeclarative },
  { name: "imperative", compare: clockOrderImperative },
  { name: "imperative inlined", compare: clockOrderImperativeInlined },
  { name: "imperative for each", compare: clockOrderImperativeForEach },
  { name: "z", compare: clockOrderZ },
];

describe.each(scenarios)("Public API: $name", ({ compare }) => {
  const { isConcurrent, isEqual, isLessThan, isLessThanOrEqual } = compare;

  it("empty clocks", () => {
    const actual = isEqual({}, {});
    expect(actual).toBe(true);
  });

  it("Equal", () => {
    const actual = isEqual({ x: 0, y: 0 }, { x: 0, y: 0 });
    expect(actual).toBe(true);
  });

  it("LessThanOrEqual", () => {
    const actual = isLessThanOrEqual({ x: 0, y: 0 }, { x: 0, y: 1 });
    expect(actual).toBe(true);
  });

  it("LessThan", () => {
    const actual = isLessThan({ x: 0, y: 0 }, { x: 1, y: 1 });
    expect(actual).toBe(true);
  });

  it("LT then CNC", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 1, y: 1 };
    expect(isLessThan(a, b)).toBe(true);
    expect(isConcurrent(b, a)).toBe(true);
  });

  it("CNC 1 -->", () => {
    const actual = isConcurrent({ x: 1, y: 0, a: 0 }, { x: 0, y: 1, a: 0 });
    expect(actual).toBe(true);
  });

  it("CNC 1 <--", () => {
    const actual = isConcurrent({ x: 0, y: 1 }, { x: 1, y: 0 });
    expect(actual).toBe(true);
  });

  it("CNC 2 -->", () => {
    const actual = isConcurrent({ x: 2, y: 2, z: 0 }, { x: 0, y: 0, z: 1 });
    expect(actual).toBe(true);
  });

  it("CNC 2 <--", () => {
    const actual = isConcurrent({ x: 0, y: 0, z: 1 }, { x: 2, y: 2, z: 0 });
    expect(actual).toBe(true);
  });
});
