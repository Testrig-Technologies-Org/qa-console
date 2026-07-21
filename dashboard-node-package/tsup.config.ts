import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/live-view-watcher.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node18",
});
