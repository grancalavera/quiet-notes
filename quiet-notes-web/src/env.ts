import { envSchema } from "./lib/env-schema";
const unsafe_env = import.meta.env;
export const env = envSchema.parse(unsafe_env);
