import { nanoid } from "nanoid";
import { of } from "rxjs";
import { AppServiceSchema } from "./app-service-schema";

export const appService: AppServiceSchema = { clientId$: of(nanoid()) };
