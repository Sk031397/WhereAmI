import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite + React app. Vitest shares this config.
// See spec.md > Stack and spec.md > Where It Runs and How Someone Tries It.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.js",
    include: ["tests/**/*.{test,spec}.{js,jsx}"],
    exclude: ["node_modules/**", "dist/**", ".trunk/**", ".vite/**"],
  },
});
