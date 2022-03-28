import { NodeId, Clock, increment as incrementClock, isLessThanOrEqual } from "./clock";

export interface LastWriterWins<T> {
  clock: Clock;
  clientId: NodeId;
  data: T;
}

export const merge = <T>(
  clientId: NodeId,
  a: LastWriterWins<T>,
  b: LastWriterWins<T>
): LastWriterWins<T> => {
  const ch = choose(clientId);

  if (isLessThanOrEqual(a.clock, b.clock)) {
    return ch(b);
  } else if (isLessThanOrEqual(b.clock, a.clock)) {
    return ch(a);
  } else if (a.clientId < b.clientId) {
    return ch(b);
  } else {
    return ch(a);
  }
};

export const update = <T>(data: T, o: LastWriterWins<T>): LastWriterWins<T> =>
  increment({ ...o, data });

const choose =
  (clientId: NodeId) =>
  <T>(o: LastWriterWins<T>): LastWriterWins<T> =>
    increment({ ...o, clientId });

const increment = <T>(o: LastWriterWins<T>): LastWriterWins<T> => ({
  ...o,
  clock: incrementClock(o.clientId, o.clock),
});
