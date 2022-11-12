export function assertNever(o: never): never {
  throw new Error("unexpected object");
}
