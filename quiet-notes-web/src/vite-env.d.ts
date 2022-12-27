/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  VITE_FIREBASE_USE_EMULATORS?: string | undefined;
  VITE_FIREBASE_EMULATOR_AUTH: string;
  VITE_FIREBASE_EMULATOR_FIRESTORE_PORT: string;
  VITE_FIREBASE_EMULATOR_FUNCTIONS_PORT: string;
  VITE_ENABLE_PWA_DEV?: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __filename: string;
