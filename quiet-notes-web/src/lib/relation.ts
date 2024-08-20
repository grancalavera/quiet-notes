import { contextBinder } from "@react-rxjs/utils";
import { createContext, useContext } from "react";
import { filter, map, Observable } from "rxjs";
import { contextualizeSignal, SignalInContext } from "./contextualizeSignal";

export type RelationKey = string | undefined;
export type Relation<T> = SignalInContext<RelationKey, T>;
export type RelatedSignal<T> = Observable<Relation<T>>;

export const RelatedContext = createContext<RelationKey>(undefined);

export const useRelation = () => useContext(RelatedContext);

export const bindRelation = contextBinder(() => useRelation());

export const createRelatedSignal = contextualizeSignal(RelatedContext);

export const selectRelation =
  (relation: RelationKey) =>
  <T>(source$: RelatedSignal<T>) =>
    source$.pipe(
      filter((signal) => signal.context === relation),
      map((signal) => signal.value)
    );
