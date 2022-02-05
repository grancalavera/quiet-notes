import { createBrowserHistory } from "history";
import { Observable } from "rxjs";
import { shareReplay } from "rxjs/operators";

export const globalHistory = createBrowserHistory();

export const location$ = new Observable<typeof globalHistory["location"]>((observer) => {
  observer.next(globalHistory.location);
  return globalHistory.listen(() => {
    observer.next(globalHistory.location);
  });
}).pipe(shareReplay({ bufferSize: 1, refCount: true }));
