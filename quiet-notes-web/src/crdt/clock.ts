export type Clock = Record<NodeId, TimeStamp | undefined>;

export type NodeId = string;
type TimeStamp = number;

type ClockOrder = LT | LTE | EQ | CNC;
type TimeOrder = LT | EQ | CNC;

type LT = "LT";
type LTE = "LTE";
type EQ = "EQ";
type CNC = "CNC";

const isClockOrder =
  (order: ClockOrder) =>
  (a: Clock, b: Clock): boolean =>
    orderClocks_internal(a, b) === order;

export const isEqual = isClockOrder("EQ");
export const isLessThan = isClockOrder("LT");
export const isLessThanOrEqual = isClockOrder("LTE");
export const isConcurrent = isClockOrder("CNC");

export const increment = (clientId: NodeId, clock: Clock): Clock => ({
  ...clock,
  [clientId]: getTime(clientId, clock) + 1,
});

const orderClocks_internal = (a: Clock, b: Clock): ClockOrder => {
  const [head, ...tail] = compareClocks_internal(a, b);

  return head === undefined
    ? "EQ"
    : tail.reduce((result, current) => {
        if (result === "EQ" && current === "EQ") {
          return "EQ";
        } else if (result === "LT" && current === "LT") {
          return "LT";
        } else if ((result === "EQ" || result === "LT") && (current === "EQ" || current === "LT")) {
          return "LTE";
        } else {
          return "CNC";
        }
      }, head as ClockOrder);
};

export const compareClocks_internal = (a: Clock, b: Clock): TimeOrder[] => {
  const order = orderTimes_internal(a, b);
  const nodes = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...nodes].map(order);
};

export const orderTimes_internal =
  (a: Clock, b: Clock) =>
  (id: NodeId): TimeOrder => {
    const ta = getTime(id, a);
    const tb = getTime(id, b);

    if (ta === tb) {
      return "EQ";
    } else if (ta < tb) {
      return "LT";
    } else {
      return "CNC";
    }
  };

const getTime = (nodeId: NodeId, clock: Clock): number => clock[nodeId] ?? Number.NEGATIVE_INFINITY;
