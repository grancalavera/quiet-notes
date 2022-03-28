import {
  compareClocks_internal,
  isConcurrent,
  isEqual,
  isLessThan,
  isLessThanOrEqual,
  orderTimes_internal,
} from "./clock";

describe("public api", () => {
  it("empty clocks", () => {
    const actual = isEqual({}, {});
    expect(actual).toBe(true);
  });

  it("EQ", () => {
    const actual = isEqual({ x: 0, y: 0 }, { x: 0, y: 0 });
    expect(actual).toBe(true);
  });

  it("LTE", () => {
    const actual = isLessThanOrEqual({ x: 0, y: 0 }, { x: 0, y: 1 });
    expect(actual).toBe(true);
  });

  it("LT", () => {
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
    const actual = isConcurrent({ x: 1, y: 0 }, { x: 0, y: 1 });
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

describe("clock comparison", () => {
  it("empty clocks", () => {
    const actual = compareClocks_internal({}, {});
    expect(actual).toEqual([]);
  });

  it("[EQ, EQ]", () => {
    const actual = compareClocks_internal({ x: 0, y: 0 }, { x: 0, y: 0 });
    expect(actual).toEqual(["EQ", "EQ"]);
  });

  it("[EQ, LT]", () => {
    const actual = compareClocks_internal({ x: 0, y: 0 }, { y: 1, x: 0 });
    expect(actual).toEqual(["EQ", "LT"]);
  });

  it("[LT, LT]", () => {
    const actual = compareClocks_internal({ x: 0, y: 0 }, { y: 1, x: 1 });
    expect(actual).toEqual(["LT", "LT"]);
  });

  it("[CNC, EQ]", () => {
    const actual = compareClocks_internal({ x: 1, y: 0 }, { y: 0, x: 0 });
    expect(actual).toEqual(["CNC", "EQ"]);
  });
});

describe("time ordering", () => {
  it("both clocks empty = equal times", () => {
    const actual = orderTimes_internal({}, {})("x");
    expect(actual).toEqual("EQ");
  });

  it("left clock empty = less than", () => {
    const actual = orderTimes_internal({}, { x: 0 })("x");
    expect(actual).toEqual("LT");
  });

  it("right clock empty = concurrent", () => {
    const actual = orderTimes_internal({ x: 0 }, {})("x");
    expect(actual).toEqual("CNC");
  });

  it("equal times", () => {
    const actual = orderTimes_internal({ x: 0 }, { x: 0 })("x");
    expect(actual).toEqual("EQ");
  });

  it("equal times", () => {
    const actual = orderTimes_internal({ x: 0 }, { x: 0 })("x");
    expect(actual).toEqual("EQ");
  });

  it("less than time", () => {
    const actual = orderTimes_internal({ x: 0 }, { x: 1 })("x");
    expect(actual).toEqual("LT");
  });

  it("concurrent time", () => {
    const actual = orderTimes_internal({ x: 1 }, { x: 0 })("x");
    expect(actual).toEqual("CNC");
  });
});
