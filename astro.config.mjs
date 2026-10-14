// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// The deploy workflow sets SITE and BASE_PATH from GitHub Pages itself (the
// repo's default address, https://arvinduh.github.io/zisha/). Locally both are
// unset and the site lives at /. Every internal link goes through `href()` in
// src/lib/url.ts to pick up the base.
export default defineConfig({
  site: process.env.SITE || undefined,
  base: process.env.BASE_PATH || "/",
  trailingSlash: "always",
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Crimson Pro",
      cssVariable: "--font-serif",
      weights: ["300 800"],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "serif"],
    },
  ],
});
