import { compareClocks_internal, isCNC, isEQ, isLT, isLTE, orderTimes_internal } from "./clock";

describe("public api", () => {
  it("empty clocks", () => {
    const actual = isEQ({}, {});
    expect(actual).toBe(true);
  });

  it("EQ", () => {
    const actual = isEQ({ x: 0, y: 0 }, { x: 0, y: 0 });
    expect(actual).toBe(true);
  });

  it("LTE", () => {
    const actual = isLTE({ x: 0, y: 0 }, { x: 0, y: 1 });
    expect(actual).toBe(true);
  });

  it("LT", () => {
    const actual = isLT({ x: 0, y: 0 }, { x: 1, y: 1 });
    expect(actual).toBe(true);
  });

  it("CNC", () => {
    const actual = isCNC({ x: 1, y: 0 }, { y: 0, x: 0 });
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
    const actual = orderTimes_internal({}, {}, "x");
    expect(actual).toEqual("EQ");
  });

  it("left clock empty = less than", () => {
    const actual = orderTimes_internal({}, { x: 0 }, "x");
    expect(actual).toEqual("LT");
  });

  it("right clock empty = concurrent", () => {
    const actual = orderTimes_internal({ x: 0 }, {}, "x");
    expect(actual).toEqual("CNC");
  });

  it("equal times", () => {
    const actual = orderTimes_internal({ x: 0 }, { x: 0 }, "x");
    expect(actual).toEqual("EQ");
  });

  it("equal times", () => {
    const actual = orderTimes_internal({ x: 0 }, { x: 0 }, "x");
    expect(actual).toEqual("EQ");
  });

  it("less than time", () => {
    const actual = orderTimes_internal({ x: 0 }, { x: 1 }, "x");
    expect(actual).toEqual("LT");
  });

  it("concurrent time", () => {
    const actual = orderTimes_internal({ x: 1 }, { x: 0 }, "x");
    expect(actual).toEqual("CNC");
  });
});
