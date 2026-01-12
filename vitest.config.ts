import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "ref/**/*"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      // Force single instance of Three.js
      three: path.resolve(__dirname, "node_modules/three"),
    },
    dedupe: ["three", "@react-three/fiber", "@react-three/drei"],
  },
  optimizeDeps: {
    include: ["three", "@react-three/fiber", "@react-three/drei"],
    force: !!process.env.CI,
  },
});
