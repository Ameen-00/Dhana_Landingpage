import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: ".",
  publicDir: "public",
  // Relative base so the built site works at any location — a GitHub Pages
  // sub-path (/Dhana_Landingpage/) now, or a custom-domain root later — with no rebuild.
  base: "./",
  server: {
    port: 5173,
    host: true,
    // "Get a call from Dhana" backend (server/dev-server.mjs). Change target for prod.
    proxy: {
      "/api/call-me": {
        target: `http://127.0.0.1:${process.env.CALL_ME_PORT || 3001}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        pricing: resolve(root, "pricing.html"),
        useCases: resolve(root, "use-cases.html"),
        resources: resolve(root, "resources.html"),
        article: resolve(root, "article.html"),
        contact: resolve(root, "contact.html"),
      },
    },
  },
});
