import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "ref/**/*"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
