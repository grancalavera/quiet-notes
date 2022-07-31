import { Observable } from "rxjs";

export interface AppServiceSchema {
  clientId$: Observable<string>;
}
