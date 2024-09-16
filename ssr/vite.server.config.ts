import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// This file is used for pre-rendering. This is dirt easy in Preact.

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // vite.config.js
  build: {
    rollupOptions: {
      input: {
        entry: "ssr/entry-server.tsx",
      },
      output: [
        {
          minifyInternalExports: false,
          exports: "named",
          dir: "dist/.server",
          entryFileNames: "entry-server.js",
          name: "entry",
        },
      ],
    },
    // sourcemap: true,
  },
});
