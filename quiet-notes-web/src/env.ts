import { envSchema } from "./lib/env-schema";

export const env = envSchema.parse(import.meta.env);
