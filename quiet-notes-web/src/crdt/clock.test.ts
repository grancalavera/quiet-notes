import { merge, increment, initialize, isLessThan, receive } from "./clock";

describe("Clock Order", () => {
  it("empty clocks", () => {
    const actual = isLessThan({}, {});
    expect(actual).toBe(false);
  });

  it("right empty", () => {
    const actual = isLessThan({ x: 0 }, {});
    expect(actual).toBe(false);
  });

  it("left empty", () => {
    const actual = isLessThan({}, { x: 0 });
    expect(actual).toBe(false);
  });

  it("LessThan", () => {
    const actual = isLessThan({ x: 0, y: 0 }, { x: 1, y: 1 });
    expect(actual).toBe(true);
  });
});

describe("vector clock algorithm", () => {
  it("initialize", () => {
    const actual = initialize("a");
    expect(actual).toEqual({ a: 0 });
  });

  it("increment: when node is not in the clock", () => {
    const actual = increment("x", {});
    expect(actual).toEqual({ x: 1 });
  });

  it("increment: when node is in the clock", () => {
    const actual = increment("x", { x: 0, y: 0 });
    expect(actual).toEqual({ x: 1, y: 0 });
  });

  it("merge two empty clocks", () => {
    const actual = merge({}, {});
    expect(actual).toEqual({});
  });

  it("merge empty to non empty", () => {
    const actual = merge({}, { x: 0 });
    expect(actual).toEqual({ x: 0 });
  });

  it("merge non empty to empty", () => {
    const actual = merge({ x: 0 }, {});
    expect(actual).toEqual({ x: 0 });
  });

  it("merge non empty to non empty", () => {
    const actual = merge({ x: 0, y: 1, z: 0, a: 0 }, { x: 0, y: 0, z: 1 });
    expect(actual).toEqual({ x: 0, y: 1, z: 1, a: 0 });
  });

  it("receive", () => {
    const actual = receive("x", { x: 0 }, { x: 1, y: 0 });
    expect(actual).toEqual({ x: 2, y: 0 });
  });
});
