export function assertNever(o: never) {
  throw new Error("unexpected object");
}
