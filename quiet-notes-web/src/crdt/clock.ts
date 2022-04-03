export type Clock = Record<NodeId, TimeStamp | undefined>;

export type NodeId = string;
type TimeStamp = number;

type ClockOrder = LT | LTE | EQ | CNC;
type TimeOrder = LT | EQ | CNC;
type OrderClocks = (a: Clock, b: Clock) => ClockOrder;

const LT = "LessThan" as const;
const LTE = "LessThanOrEqual" as const;
const EQ = "Equal" as const;
const CNC = "Concurrent" as const;

type LT = typeof LT;
type LTE = typeof LTE;
type EQ = typeof EQ;
type CNC = typeof CNC;

export type IsClockOrder = {
  [key in `is${ClockOrder}`]: (a: Clock, b: Clock) => boolean;
};

const isClockOrder =
  (orderClocks: OrderClocks) =>
  (order: ClockOrder) =>
  (a: Clock, b: Clock): boolean =>
    orderClocks(a, b) === order;

const createClockOrder = (orderClock: OrderClocks): IsClockOrder => {
  const isOrder = isClockOrder(orderClock);
  return {
    isEqual: isOrder(EQ),
    isLessThan: isOrder(LT),
    isLessThanOrEqual: isOrder(LTE),
    isConcurrent: isOrder(CNC),
  };
};

const compareClocks = (a: Clock, b: Clock): TimeOrder[] => [...nodeSet(a, b)].map(orderTimes(a, b));

const orderTimes =
  (a: Clock, b: Clock) =>
  (id: NodeId): TimeOrder => {
    const ta = getTime(id, a);
    const tb = getTime(id, b);

    if (ta === tb) {
      return EQ;
    } else if (ta < tb) {
      return LT;
    } else {
      return CNC;
    }
  };

const getTime = (node: NodeId, clock: Clock): number => clock[node] ?? Number.NEGATIVE_INFINITY;

const nodeSet = (a: Clock, b: Clock): Set<NodeId> =>
  new Set([...Object.keys(a), ...Object.keys(b)]);

export const clockOrderDeclarative = createClockOrder((a, b) => {
  const [head, ...tail] = compareClocks(a, b);

  return head === undefined
    ? EQ
    : tail.reduce((result, current) => {
        if (result === EQ && current === EQ) {
          return EQ;
        } else if (result === LT && current === LT) {
          return LT;
        } else if ((result === EQ || result === LT) && (current === EQ || current === LT)) {
          return LTE;
        } else {
          return CNC;
        }
      }, head as ClockOrder);
});

export const clockOrderImperative = createClockOrder((a, b) => {
  let result: ClockOrder | undefined;

  for (let node of nodeSet(a, b)) {
    const current = orderTimes(a, b)(node);

    if (result === undefined) {
      result = current;
    } else if (result === EQ && current === EQ) {
      result = EQ;
    } else if (result === LT && current === LT) {
      result = LT;
    } else if ((result === EQ || result === LT) && (current === EQ || current === LT)) {
      result = LTE;
    } else {
      result = CNC;
      break;
    }
  }

  return result ?? EQ;
});

export const clockOrderImperativeInlined = createClockOrder((a, b) => {
  let result: ClockOrder | undefined;

  for (let node of nodeSet(a, b)) {
    let current: TimeOrder;

    const ta = a[node] ?? Number.NEGATIVE_INFINITY;
    const tb = b[node] ?? Number.NEGATIVE_INFINITY;

    if (ta === tb) {
      current = EQ;
    } else if (ta < tb) {
      current = LT;
    } else {
      current = CNC;
    }

    if (result === undefined) {
      result = current;
    } else if (result === EQ && current === EQ) {
      result = EQ;
    } else if (result === LT && current === LT) {
      result = LT;
    } else if ((result === EQ || result === LT) && (current === EQ || current === LT)) {
      result = LTE;
    } else {
      result = CNC;
      break;
    }
  }

  return result ?? EQ;
});

export const clockOrderImperativeForEach = createClockOrder((a, b) => {
  let result: ClockOrder | undefined;

  nodeSet(a, b).forEach((node) => {
    const current = orderTimes(a, b)(node);

    if (result === undefined) {
      result = current;
    } else if (result === EQ && current === EQ) {
      result = EQ;
    } else if (result === LT && current === LT) {
      result = LT;
    } else if ((result === EQ || result === LT) && (current === EQ || current === LT)) {
      result = LTE;
    } else {
      result = CNC;
    }
  });

  return result ?? EQ;
});

export const clockOrderZ = createClockOrder((a, b) => {
  const nodes = [...Object.keys(a), ...Object.keys(b)];
  const seen: Record<NodeId, boolean> = {};
  let result: ClockOrder | undefined;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node === undefined || seen[node]) {
      continue;
    }

    seen[node] = true;

    let current: TimeOrder;

    const ta = a[node] ?? Number.NEGATIVE_INFINITY;
    const tb = b[node] ?? Number.NEGATIVE_INFINITY;

    if (ta === tb) {
      current = EQ;
    } else if (ta < tb) {
      current = LT;
    } else {
      current = CNC;
    }

    if (result === undefined) {
      result = current;
    } else if (result === EQ && current === EQ) {
      result = EQ;
    } else if (result === LT && current === LT) {
      result = LT;
    } else if ((result === EQ || result === LT) && (current === EQ || current === LT)) {
      result = LTE;
    } else {
      result = CNC;
      break;
    }
  }

  return result ?? EQ;
});
