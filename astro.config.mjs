import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://www.gnatnib.site",
  output: "static",
  adapter: vercel(),
  trailingSlash: "never",
  prefetch: true,
  // Routes from the previous Next.js site. Everything they showed now lives
  // on the home page, so inbound links land on the matching section.
  redirects: {
    "/about": "/#about",
    "/work": "/#work",
    "/experience": "/#experience",
    "/contact": "/#contact",
    "/gallery": "/",
  },
});
