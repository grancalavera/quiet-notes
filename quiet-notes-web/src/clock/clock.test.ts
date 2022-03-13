import { compareClocks, orderClocks, orderTimes } from "./clock";

describe("clock ordering", () => {
  it("empty clocks", () => {
    const actual = orderClocks({}, {});
    expect(actual).toEqual("EQ");
  });

  it("EQ", () => {
    const actual = orderClocks({ x: 0, y: 0 }, { x: 0, y: 0 });
    expect(actual).toEqual("EQ");
  });

  it("LTE", () => {
    const actual = orderClocks({ x: 0, y: 0 }, { x: 0, y: 1 });
    expect(actual).toEqual("LTE");
  });

  it("LT", () => {
    const actual = orderClocks({ x: 0, y: 0 }, { x: 1, y: 1 });
    expect(actual).toEqual("LT");
  });

  it("CNC", () => {
    const actual = orderClocks({ x: 1, y: 0 }, { y: 0, x: 0 });
    expect(actual).toEqual("CNC");
  });
});

describe("clock comparison", () => {
  it("empty clocks", () => {
    const actual = compareClocks({}, {});
    expect(actual).toEqual([]);
  });

  it("[EQ, EQ]", () => {
    const actual = compareClocks({ x: 0, y: 0 }, { x: 0, y: 0 });
    expect(actual).toEqual(["EQ", "EQ"]);
  });

  it("[EQ, LT]", () => {
    const actual = compareClocks({ x: 0, y: 0 }, { y: 1, x: 0 });
    expect(actual).toEqual(["EQ", "LT"]);
  });

  it("[LT, LT]", () => {
    const actual = compareClocks({ x: 0, y: 0 }, { y: 1, x: 1 });
    expect(actual).toEqual(["LT", "LT"]);
  });

  it("[CNC, EQ]", () => {
    const actual = compareClocks({ x: 1, y: 0 }, { y: 0, x: 0 });
    expect(actual).toEqual(["CNC", "EQ"]);
  });
});

describe("time ordering", () => {
  it("both clocks empty = equal times", () => {
    const actual = orderTimes({}, {}, "x");
    expect(actual).toEqual("EQ");
  });

  it("left clock empty = less than", () => {
    const actual = orderTimes({}, { x: 0 }, "x");
    expect(actual).toEqual("LT");
  });

  it("right clock empty = concurrent", () => {
    const actual = orderTimes({ x: 0 }, {}, "x");
    expect(actual).toEqual("CNC");
  });

  it("equal times", () => {
    const actual = orderTimes({ x: 0 }, { x: 0 }, "x");
    expect(actual).toEqual("EQ");
  });

  it("equal times", () => {
    const actual = orderTimes({ x: 0 }, { x: 0 }, "x");
    expect(actual).toEqual("EQ");
  });

  it("less than time", () => {
    const actual = orderTimes({ x: 0 }, { x: 1 }, "x");
    expect(actual).toEqual("LT");
  });

  it("concurrent time", () => {
    const actual = orderTimes({ x: 1 }, { x: 0 }, "x");
    expect(actual).toEqual("CNC");
  });
});
