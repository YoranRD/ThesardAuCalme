import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { activeBasePath, activeSiteUrl } from "./src/config/site";

export default defineConfig({
  site: activeSiteUrl,
  base: activeBasePath,
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/out/")
    })
  ]
});
