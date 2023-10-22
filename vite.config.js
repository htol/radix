import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 8001,
    },
    plugins: [
      vue(),
      eslintPlugin({
        exclude: ["/virtual:/**", "/node_modules/**"],
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        environment:
          mode === "production"
            ? resolve(__dirname, "src/environments/environment.prod")
            : resolve(__dirname, "src/environments/environment"),
      },
      test: {},
    },
  };
});
