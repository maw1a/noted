import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [tailwindcss(), preact()],
	resolve: {
		alias: {
			react: "preact/compat",
			"react-dom/test-utils": "preact/test-utils",
			"react-dom": "preact/compat",
			"react/jsx-runtime": "preact/jsx-runtime",
		},
	},
});
