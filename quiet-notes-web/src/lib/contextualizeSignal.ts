import { Context, useCallback, useContext } from "react";
import { identity, Observable, Subject } from "rxjs";

export type SignalInContext<C, T = void> = {
  context: C;
  value: T;
};

export function contextualizeSignal<C>(context: Context<C>) {
  // prettier-ignore
  function createSignal(): [Observable<SignalInContext<C>>, () => () => void];
  // prettier-ignore
  function createSignal<T>(): [Observable<SignalInContext<C,T>>, () => (payload: T) => void];
  // prettier-ignore
  function createSignal<A extends unknown[], T>(mapper: (...args: A) => T): [Observable<SignalInContext<C,T>>, () => (...args: A) => void];
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createSignal<A extends unknown[], T>(mapper: (...args: A) => T = identity as any): [Observable<SignalInContext<C,T>>, () => (...args: A) => void] {
    const subject = new Subject<SignalInContext<C,T>>();

    const signal$ = subject.asObservable();

    const useSignalSetter = () => {
      const contextValue = useContext(context);
      return useCallback((...args: A) => {
        return subject.next({context:contextValue, value:mapper(...args)});
      },  [contextValue]);
    };

    return [signal$, useSignalSetter];
  }

  return createSignal;
}
