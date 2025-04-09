import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { clientPort } from "./src/common/appConstants";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: clientPort, // dev server
	},
	preview: {
		port: clientPort, // production preview server
	},
});
