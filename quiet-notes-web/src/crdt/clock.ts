export type Clock = Record<NodeId, TimeStamp | undefined>;

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

  for (let n of new Set(Object.keys(a).concat(Object.keys(b)))) {
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

const getTime = (node: NodeId, clock: Clock): number => clock[node] ?? Number.NEGATIVE_INFINITY;

const isClockOrder =
  (o: ClockOrder) =>
  (a: Clock, b: Clock): boolean =>
    orderClocks(a, b) === o;

export const isEqual = isClockOrder(EQ);
export const isLessThan = isClockOrder(LT);
export const isLessThanOrEqual = isClockOrder(LTE);
export const isConcurrent = isClockOrder(CNC);
