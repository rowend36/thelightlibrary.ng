import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ssr: {},
  // vite.config.js
  build: {
    rollupOptions: {
      input: {
        main: new URL(
          process.env.NODE_ENV === "development"
            ? "ssr/entry-client.html"
            : "index.html",
          import.meta.url
        ).pathname,
      },
      output: [
        {
          name: "main",
        },
      ],
    },
    sourcemap: true,
  },
});
