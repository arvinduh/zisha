/**
 * The favicon, generated at build time from the same drawing as the page
 * mark and coloured from the palette.
 */
import type { APIRoute } from "astro";
import { palette } from "../lib/palette";
import { iconSvg } from "../lib/teapot";

const hex = (token: string): string =>
  palette.find((s) => s.token === token)!.hex;

export const GET: APIRoute = () =>
  new Response(iconSvg(hex("espresso"), hex("surface")), {
    headers: { "Content-Type": "image/svg+xml" },
  });
