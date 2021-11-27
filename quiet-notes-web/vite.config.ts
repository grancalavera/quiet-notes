import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const emulated = process.env.REACT_APP_FIREBASE_USE_EMULATORS === "true";
const target = emulated ? "http://localhost:5000" : "https://quiet-notes-e83fb.web.app";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    //
    // ┌────────────────┬────────────────┬─────────────────────────────────┐
    // │ Emulator       │ Host:Port      │ View in Emulator UI             │
    // ├────────────────┼────────────────┼─────────────────────────────────┤
    // │ Authentication │ localhost:9099 │ http://localhost:4000/auth      │
    // ├────────────────┼────────────────┼─────────────────────────────────┤
    // │ Functions      │ localhost:5001 │ http://localhost:4000/functions │
    // ├────────────────┼────────────────┼─────────────────────────────────┤
    // │ Firestore      │ localhost:8080 │ http://localhost:4000/firestore │
    // ├────────────────┼────────────────┼─────────────────────────────────┤
    // │ Hosting        │ localhost:5000 │ n/a                             │
    // └────────────────┴────────────────┴─────────────────────────────────┘
    //   Emulator Hub running at localhost:4400
    //   Other reserved ports: 4500

    // https://vitejs.dev/config/#server-proxy
    // https://github.com/http-party/node-http-proxy#options
    proxy: {
      "^/__/firebase/.*": { target, changeOrigin: true },
    },
  },
});
