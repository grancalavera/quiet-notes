import { isConcurrent, isEqual, isLessThan, isLessThanOrEqual } from "./clock";

describe("Clock Order", () => {
  it("empty clocks", () => {
    const actual = isEqual({}, {});
    expect(actual).toBe(true);
  });

  it("right empty", () => {
    const actual = isLessThan({ x: 0 }, {});
    expect(actual).toBe(false);
  });

  it("left empty", () => {
    const actual = isLessThan({}, { x: 0 });
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
