import { cloudflare } from "@cloudflare/vite-plugin";
import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  build: {
    // The first screen is the interactive Three.js scene, so the initial 3D
    // bundle is expected to exceed Vite's generic 500 kB warning threshold.
    chunkSizeWarningLimit: 1200,
    rolldownOptions: {
      checks: {
        pluginTimings: false,
      },
    },
  },
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
    }),
  ],
});
