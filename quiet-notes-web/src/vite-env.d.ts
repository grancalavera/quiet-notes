/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  VITE_FIREBASE_USE_EMULATORS: "true" | undefined;
  VITE_FIREBASE_EMULATOR_AUTH: string;
  VITE_FIREBASE_EMULATOR_FIRESTORE_PORT: string;
  VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
