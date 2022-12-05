import * as crdt from "../crdt/clock";
import { Note } from "./notebook-model";

type Envelope = Empty | NotEmpty;
type NotEmpty = Local | Remote | Merged;

interface Empty {
  kind: "Empty";
}

interface Local {
  kind: "Local";
  note: Note;
}

interface Remote {
  kind: "Remote";
  note: Note;
}

interface Merged {
  kind: "Merged";
  note: Note;
}

const isMerged = (candidate: Envelope): candidate is Merged =>
  candidate.kind === "Merged";

const isEmpty = (candidate: Envelope): candidate is Empty =>
  candidate.kind === "Empty";

const sameOrigin = (a: Envelope, b: Envelope): boolean => a.kind === b.kind;

export const mergeNotes =
  (clientId: string) =>
  (previous: Envelope, next: Envelope): Envelope => {
    if (sameOrigin(previous, next) || isEmpty(previous) || isEmpty(next)) {
      return next;
    }

    const note = isMerged(previous)
      ? mergeClocks(clientId, next.note, previous.note)
      : mergeClocks(clientId, previous.note, next.note);

    return { kind: "Merged", note };
  };

const mergeClocks = (clientId: string, left: Note, right: Note): Note => {
  const clock = crdt.receive(clientId, left.clock, right.clock);
  const note = crdt.isLessThan(left.clock, right.clock) ? right : left;
  return { ...note, clock };
};

export const incrementClock =
  (clientId: string) =>
  <T extends Note | undefined>(note: T): T =>
    note ? { ...note, clock: crdt.increment(clientId, note.clock) } : note;

export const empty: Envelope = { kind: "Empty" };

export const wrap =
  (kind: "Local" | "Remote") =>
  (note: Note | undefined): Envelope =>
    note ? { kind, note } : empty;

export const unWrap = (envelope: Envelope): Note | undefined =>
  isEmpty(envelope) ? undefined : envelope.note;
