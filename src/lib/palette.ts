/**
 * The colour palette: the single source for both the CSS custom properties
 * (emitted on :root by the layout) and the swatches on the About page.
 * Every colour here is in use; tints are mixed from these in CSS.
 */

/** One colour token and the job it does. */
export type Swatch = { token: string; name: string; hex: string; role: string };

export const palette: Swatch[] = [
  { token: "bg", name: "Oat", hex: "#f3ece1", role: "Page" },
  { token: "surface", name: "Linen", hex: "#faf6f0", role: "Menu, timer" },
  { token: "line", name: "Hairline", hex: "#e2d6c6", role: "Dividers" },
  { token: "muted", name: "Taupe", hex: "#74655a", role: "Notes" },
  { token: "ink", name: "Walnut", hex: "#3b2e25", role: "Text" },
  { token: "espresso", name: "Espresso", hex: "#2f241d", role: "Buttons" },
  { token: "honey", name: "Honey", hex: "#c8a46e", role: "Progress, links" },
  { token: "terracotta", name: "Terracotta", hex: "#9a4e36", role: "Warnings" },
];

/** The palette as a `:root` rule of custom properties. */
export function paletteCss(): string {
  return `:root{${palette.map((s) => `--${s.token}:${s.hex}`).join(";")}}`;
}
