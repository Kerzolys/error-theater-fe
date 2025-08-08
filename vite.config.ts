// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // вот тут
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  build: {
    outDir: "dist",
  },
  base: "/",
});
