export type Clock = Record<NodeId, TimeStamp>;

type NodeId = string;
type TimeStamp = number;

const getTime = (n: NodeId, c: Clock): number => c[n] ?? 0;

const uniqueNodes = (a: Clock, b: Clock): Set<NodeId> =>
  new Set(Object.keys(a).concat(Object.keys(b)));

export const isLessThan = (a: Clock, b: Clock): boolean => {
  let result = false;

  for (let n of uniqueNodes(a, b)) {
    const comp = (a[n] ?? 0) - (b[n] ?? 0);
    if (comp > 0) {
      return false;
    } else if (comp < 0) {
      result = true;
    }
  }

  return result;
};

export const initialize = (nodeId: NodeId): Clock => ({ [nodeId]: 0 });

export const empty = (): Clock => ({});

export const increment = (nodeId: NodeId, clock: Clock) => {
  const time = clock[nodeId];
  return time === undefined ? { ...clock, [nodeId]: 1 } : { ...clock, [nodeId]: time + 1 };
};

export const merge = (a: Clock, b: Clock): Clock => {
  const clock: Clock = {};
  for (let n of uniqueNodes(a, b)) {
    clock[n] = Math.max(getTime(n, a), getTime(n, b));
  }
  return clock;
};

export const receive = (nodeId: NodeId, previousClock: Clock, nextClock: Clock): Clock =>
  increment(nodeId, merge(previousClock, nextClock));
