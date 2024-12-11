import path from "path";
import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	css: {
		postcss: {
			plugins: [tailwindcss, autoprefixer],
		},
	},
	plugins: [reactRouter(), tsconfigPaths()],
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./app"),
		},
	},
	server: {
		// proxy: {
		// 	"/admin": {
		// 		target: "http://localhost:3000",
		// 		changeOrigin: true,
		// 		rewrite: (path) => path.replace(/^\/admin/, ""),
		// 	},
		// },
    port: 3001,
    host: '0.0.0.0',
	},
});