import ViteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const emulated = process.env.REACT_APP_FIREBASE_USE_EMULATORS === "true";
const target = emulated
  ? "http://localhost:5000"
  : "https://quiet-notes-e83fb.web.app";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ViteReact(),
    VitePWA({
      registerType: "prompt",
      devOptions: { enabled: true },
      workbox: { sourcemap: true },
      includeAssets: [
        "apple-touch-icon-114x114.png",
        "apple-touch-icon-120x120.png",
        "apple-touch-icon-144x144.png",
        "apple-touch-icon-152x152.png",
        "apple-touch-icon-57x57.png",
        "apple-touch-icon-60x60.png",
        "apple-touch-icon-72x72.png",
        "apple-touch-icon-76x76.png",
        "favicon-128.png",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon-196x196.png",
        "favicon.ico",
        "mstile-144x144.png",
        "mstile-150x150.png",
        "mstile-310x150.png",
        "mstile-310x310.png",
        "mstile-70x70.png",
      ],
      manifest: {
        name: "Quiet Notes",
        short_name: "Quiet Notes",
        description: "Quiet Notes",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],

  server: {
    port: 3000,
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
