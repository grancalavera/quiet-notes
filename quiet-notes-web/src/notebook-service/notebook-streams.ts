import { bind } from "@react-rxjs/core";
import { tap } from "rxjs/operators";
import { user$ } from "../auth/user-streams";

export const notesCollection$ = user$.pipe(tap((user) => console.log({ user })));

export const [useTheNotesCollection] = bind(notesCollection$);
