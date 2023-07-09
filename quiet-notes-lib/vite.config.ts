import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import packageJson from "./package.json" assert { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const escape = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const external = Object.keys(packageJson.peerDependencies ?? {}).map(
  (importPath) =>
    ["react", "react-dom"].includes(importPath)
      ? importPath
      : new RegExp(`^${escape(importPath)}(\\/.*)?`)
);

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: { external },
    sourcemap: true,
    minify: false,
  },
});
