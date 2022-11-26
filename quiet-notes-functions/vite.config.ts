import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    outDir: "../quiet-notes-functions-dist/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "quiet-notes-functions",
      fileName: "quiet-notes-functions",
    },
    rollupOptions: {
      external: [
        "firebase-admin",
        "firebase-admin/auth",
        "firebase-admin/firestore",
        "firebase-functions-test",
        "firebase-functions",
      ],
      output: {
        globals: {
          "firebase-admin": "firebase_admin",
          "firebase-admin/auth": "firebase_admin_auth",
          "firebase-admin/firestore": "firebase_admin_firestore",
          "firebase-functions": "firebase_functions",
        },
      },
    },
  },
});
