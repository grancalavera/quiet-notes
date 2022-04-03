import * as b from "benny";
import {
  Clock,
  clockOrderDeclarative,
  clockOrderImperative,
  clockOrderImperativeInlined,
  clockOrderImperativeForEach,
  clockOrderZ,
} from "../crdt/clock";

const makeClock = (size: number): Clock => {
  const length = Math.max(0, Math.floor(size));
  const nodes = Array.from({ length }).map((_, i) => [`z${i.toString()}`, 0]);
  return Object.fromEntries(nodes);
};

const size = 100_000;

const earlyCncA: Clock = { ...{ x: 1, y: 0 }, ...makeClock(size) };
const earlyCncB: Clock = { ...{ x: 0, y: 1 }, ...makeClock(size) };

b.suite(
  "Vector Clocks: early CNC",

  b.add("clockOrderDeclarative.isEqual", () => {
    clockOrderDeclarative.isEqual(earlyCncA, earlyCncB);
  }),

  b.add("clockOrderImperative.isEqual", () => {
    clockOrderImperative.isEqual(earlyCncA, earlyCncB);
  }),

  b.add("clockOrderImperativeInlined.isEqual", () => {
    clockOrderImperativeInlined.isEqual(earlyCncA, earlyCncB);
  }),

  b.add("clockOrderImperativeForEach.isEqual", () => {
    clockOrderImperativeForEach.isEqual(earlyCncA, earlyCncB);
  }),

  b.add("clockOrderZ.isEqual", () => {
    clockOrderZ.isEqual(earlyCncA, earlyCncB);
  }),

  b.cycle(),
  b.complete()
);

const midCncA: Clock = { ...makeClock(size / 2), ...{ x: 1, y: 0 }, ...makeClock(size / 2) };
const midCncB: Clock = { ...makeClock(size / 2), ...{ x: 0, y: 1 }, ...makeClock(size / 2) };

b.suite(
  "Vector Clocks: mid CNC",

  b.add("clockOrderDeclarative.isEqual", () => {
    clockOrderDeclarative.isEqual(midCncA, midCncB);
  }),

  b.add("clockOrderImperative.isEqual", () => {
    clockOrderImperative.isEqual(midCncA, midCncB);
  }),

  b.add("clockOrderImperativeInlined.isEqual", () => {
    clockOrderImperativeInlined.isEqual(midCncA, midCncB);
  }),

  b.add("clockOrderImperativeForEach.isEqual", () => {
    clockOrderImperativeForEach.isEqual(midCncA, midCncB);
  }),

  b.add("clockOrderZ.isEqual", () => {
    clockOrderZ.isEqual(midCncA, midCncB);
  }),

  b.cycle(),
  b.complete()
);

const lateCncA: Clock = { ...makeClock(size), ...{ x: 1, y: 0 } };
const lateCncB: Clock = { ...makeClock(size), ...{ x: 0, y: 1 } };

b.suite(
  "Vector Clocks: late CNC",

  b.add("clockOrderDeclarative.isEqual", () => {
    clockOrderDeclarative.isEqual(lateCncA, lateCncB);
  }),

  b.add("clockOrderImperative.isEqual", () => {
    clockOrderImperative.isEqual(lateCncA, lateCncB);
  }),

  b.add("clockOrderImperativeInlined.isEqual", () => {
    clockOrderImperativeInlined.isEqual(lateCncA, lateCncB);
  }),

  b.add("clockOrderImperativeForEach.isEqual", () => {
    clockOrderImperativeForEach.isEqual(lateCncA, lateCncB);
  }),

  b.add("clockOrderZ.isEqual", () => {
    clockOrderZ.isEqual(lateCncA, lateCncB);
  }),

  b.cycle(),
  b.complete()
);

const clock = makeClock(size);

b.suite(
  "Vector Clocks: long EQ",

  b.add("clockOrderDeclarative.isEqual", () => {
    clockOrderDeclarative.isEqual(clock, clock);
  }),

  b.add("clockOrderImperative.isEqual", () => {
    clockOrderImperative.isEqual(clock, clock);
  }),

  b.add("clockOrderImperativeInlined.isEqual", () => {
    clockOrderImperativeInlined.isEqual(clock, clock);
  }),

  b.add("clockOrderImperativeForEach.isEqual", () => {
    clockOrderImperativeForEach.isEqual(clock, clock);
  }),

  b.add("clockOrderZ.isEqual", () => {
    clockOrderZ.isEqual(clock, clock);
  }),

  b.cycle(),
  b.complete()
);
