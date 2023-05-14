import z from "zod";

const portSchema = () =>
  z
    .string()
    .regex(/\d+/)
    .transform((x) => parseInt(x))
    .default("0");

const booleanSchema = () =>
  z
    .union([z.literal("true"), z.literal("false")])
    .transform((x) => x === "true")
    .default("false");

const viteEnvBuiltinsSchema = z.object({
  BASE_URL: z.string(),
  MODE: z.string(),
  DEV: z.boolean(),
  PROD: z.boolean(),
  SSR: z.boolean(),
});

export const viteEnvSchema = z.object({
  VITE_FIREBASE_PROJECT: z.string(),
  VITE_FIREBASE_PROJECT_HOSTING: z.string().url(),
  VITE_FIREBASE_USE_EMULATORS: booleanSchema(),
  VITE_FIREBASE_EMULATOR_AUTH: z.string().default(""),
  VITE_FIREBASE_EMULATOR_FIRESTORE_PORT: portSchema(),
  VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT: portSchema(),
  VITE_FIREBASE_EMULATOR_HOSTING_PORT: portSchema(),
  VITE_FIREBASE_EMULATOR_HOSTING: z.string().default(""),
  VITE_ENABLE_PWA_DEV: booleanSchema(),
});

export const envSchema = viteEnvBuiltinsSchema.merge(viteEnvSchema);
