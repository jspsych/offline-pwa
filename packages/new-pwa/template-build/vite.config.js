import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Set base path for GitHub Pages deployment
  // This will be the repo name (e.g., /my-experiment/)
  // For custom domains or root deployment, this will be /
  base: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/` : "/",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "public/index.html"),
        admin: resolve(__dirname, "public/admin.html"),
      },
    },
  },
  publicDir: "public",
});
