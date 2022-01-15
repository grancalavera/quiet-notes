import { createBrowserHistory } from "history";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

export const history = createBrowserHistory();

export const location$ = new Observable<typeof history["location"]>((observer) => {
  observer.next(history.location);

  const subscription = history.listen(() => {
    observer.next(history.location);
  });

  return subscription;
}).pipe(shareReplay(1));
