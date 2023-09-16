import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ["vue", "vue-router", "axios", "pinia", "sass", "naive-ui"],
  },
});
