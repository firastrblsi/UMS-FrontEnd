import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],

  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@core": path.resolve(__dirname, "src/core"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@domains": path.resolve(__dirname, "src/domains"),
    },

    conditions: ["browser", "module", "import", "default"],
  },

  optimizeDeps: {
    include: [
      "@chakra-ui/react",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
      "material-react-table",
    ],
  },
});
