import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), svgr()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "~", replacement: "/public" },
      { find: "@go", replacement: "/bindings" },
    ],
  },
});
