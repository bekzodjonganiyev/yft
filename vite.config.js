import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";

// In production /api/inquiry is a Vercel function (api/inquiry.js).
// In `npm run dev` the same handler is mounted here, so the form works locally.
function apiInDev() {
  return {
    name: "yft-api-in-dev",
    apply: "serve",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      for (const key of ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID", "INQUIRY_DRY_RUN"]) {
        if (env[key] !== undefined) process.env[key] = env[key];
      }
      if (process.env.INQUIRY_DRY_RUN === undefined && !process.env.TELEGRAM_BOT_TOKEN) {
        process.env.INQUIRY_DRY_RUN = "1";
      }
      server.middlewares.use("/api/inquiry", async (req, res) => {
        const { default: handler } = await server.ssrLoadModule("/api/inquiry.js");
        await handler(req, res);
      });
    },
  };
}

// Images are imported with `?as=picture&...` query strings (see src/data/media.js)
// and turned into responsive AVIF/WebP/JPEG sets at build time.
export default defineConfig({
  plugins: [react(), imagetools(), apiInDev()],
});
