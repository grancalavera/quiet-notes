export type Clock = Record<Node, Time | undefined>;
type Node = string;
type Time = number;

export type ClockOrder = "LT" | "LTE" | "EQ" | "CNC";
export type TimeOrder = "LT" | "EQ" | "CNC";

export const orderClocks = (a: Clock, b: Clock): ClockOrder => {
  const [head, ...tail] = compareClocks(a, b);

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

export const compareClocks = (a: Clock, b: Clock): TimeOrder[] =>
  [...new Set([...Object.keys(a), ...Object.keys(b)])].sort().map((n) => orderTimes(a, b, n));

export const orderTimes = (a: Clock, b: Clock, n: Node): TimeOrder => {
  const ta = a[n] ?? Number.NEGATIVE_INFINITY;
  const tb = b[n] ?? Number.NEGATIVE_INFINITY;

  if (ta === tb) {
    return "EQ";
  } else if (ta < tb) {
    return "LT";
  } else {
    return "CNC";
  }
};
