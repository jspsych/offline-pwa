import { defineConfig } from "tsup";

export default defineConfig([
  // ESM build
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ["jspsych"],
  },
  // IIFE browser build
  {
    entry: ["src/index.ts"],
    format: ["iife"],
    outDir: "dist",
    sourcemap: true,
    globalName: "jsPsychOfflineStorage",
    external: ["jspsych"],
    outExtension() {
      return { js: ".browser.js" };
    },
  },
]);
