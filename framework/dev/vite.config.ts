/** biome-ignore-all lint/style/noDefaultExport: required by Vite */

import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rootDir = path.resolve(import.meta.dirname, "../../");
const contentDir = path.resolve(rootDir, "content");
const frameworkDir = path.resolve(rootDir, "framework");

function isSubDir(parent: string, dir: string): boolean {
  const rel = path.relative(parent, dir);
  return !!rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

// https://vite.dev/config/
export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    react(),
    {
      name: "force-reload-pdf",
      handleHotUpdate({ file, server }) {
        // If we modify anything in content/, we force a full page reload
        // because <PDFViewer> doesn't digest HMR well and gets stuck.
        if (isSubDir(contentDir, file)) {
          server.ws.send({ type: "full-reload" });
          return []; // Block the standard HMR
        }
        return undefined;
      },
    },
  ],
  resolve: {
    alias: {
      content: contentDir,
      framework: frameworkDir,
    },
  },
});
