export type Clock = Record<NodeId, TimeStamp>;

type ClockOrder = LT | LTE | EQ | CNC;
type NodeOrder = LT | EQ | CNC;

const LT = "LT" as const;
const LTE = "LTE" as const;
const EQ = "EQ" as const;
const CNC = "CNC" as const;

type LT = "LT";
type LTE = "LTE";
type EQ = "EQ";
type CNC = "CNC";

type NodeId = string;
type TimeStamp = number;

const orderClocks = (a: Clock, b: Clock): ClockOrder => {
  let result: ClockOrder | undefined;

  for (let n of nodeSet(a, b)) {
    const order = orderNodes(a, b, n);

    if (result === undefined) {
      result = order;
    } else if (result === EQ && order === EQ) {
      result = EQ;
    } else if (result === LT && order === LT) {
      result = LT;
    } else if ((result === EQ || result === LT) && (order === EQ || order === LT)) {
      result = LTE;
    } else {
      result = CNC;
      break;
    }
  }

  return result ?? EQ;
};

const orderNodes = (a: Clock, b: Clock, n: NodeId): NodeOrder => {
  const ta = getTime(n, a);
  const tb = getTime(n, b);

  if (ta === tb) {
    return EQ;
  } else if (ta < tb) {
    return LT;
  } else {
    return CNC;
  }
};

const getTime = (n: NodeId, c: Clock): number => c[n] ?? Number.NEGATIVE_INFINITY;
const nodeSet = (a: Clock, b: Clock): Set<NodeId> => new Set(Object.keys(a).concat(Object.keys(b)));

const isClockOrder =
  (o: ClockOrder) =>
  (a: Clock, b: Clock): boolean =>
    orderClocks(a, b) === o;

export const isEqual = isClockOrder(EQ);
export const isLessThan = isClockOrder(LT);
export const isLessThanOrEqual = isClockOrder(LTE);
export const isConcurrent = isClockOrder(CNC);

export const initialize = (nodeId: NodeId): Clock => ({ [nodeId]: 0 });
export const empty = (): Clock => ({});

export const increment = (nodeId: NodeId, clock: Clock) => {
  const time = clock[nodeId];
  return time === undefined ? clock : { ...clock, [nodeId]: time + 1 };
};

export const merge = (a: Clock, b: Clock): Clock => {
  const clock: Clock = {};
  for (let n of nodeSet(a, b)) {
    clock[n] = Math.max(getTime(n, a), getTime(n, b));
  }
  return clock;
};

export const receive = (nodeId: NodeId, clock: Clock, incoming: Clock): Clock =>
  increment(nodeId, merge(clock, incoming));
