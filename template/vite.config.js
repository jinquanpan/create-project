import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { getQiniuConfig } from "./shell/config.js";
import pack from "./package.json";
// import config from "./shell/config.js";
import vitePluginBuildEnd from "./plugins/vite-plugin-build-end.js";
import path  from "path";

// https://vitejs.dev/config/
export default defineConfig(() => {
  let config = getQiniuConfig();
  return {
    plugins: [react(), vitePluginBuildEnd()],
    resolve: {
      alias: {
        "@": path.join(__dirname,'src'),
      },
    },
    base:
      process.env.BUILD === "dev"
        ? `${config.cdnUrl}/dev/${pack.name}`
        : process.env.BUILD === "production"
        ? `${config.cdnUrl}/production/${pack.name}/${pack.version}`
        : "/",
    server:{
      port:8008,
      open:true
    }
  };
});
