import ViteReact from "@vitejs/plugin-react";
import {
  UserConfigExport,
  defineConfig,
  loadEnv,
  splitVendorChunkPlugin,
} from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteEnvSchema } from "./src/lib/env-schema";

export default defineConfig(({ mode }) => {
  const unsafe_env = loadEnv(mode, process.cwd(), "");
  const { VITE_FIREBASE_PROJECT_HOSTING } = viteEnvSchema.parse(unsafe_env);

  const config: UserConfigExport = {
    plugins: [
      splitVendorChunkPlugin(),
      ViteReact(),
      VitePWA({
        registerType: "prompt",
        devOptions: { enabled: unsafe_env.VITE_ENABLE_PWA_DEV === "true" },
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
          start_url: "/",
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
      proxy: {
        "^/__/firebase/.*": {
          target: VITE_FIREBASE_PROJECT_HOSTING,
          changeOrigin: true,
        },
      },
    },
  };

  return config;
});
