import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      outDir: "dist",
    },
    server: {
      port: 5173,
      strictPort: true,
    },
  };
});
