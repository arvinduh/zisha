/**
 * The teapot mark, drawn once for the favicon, the page mark, and the QR
 * centre icon.
 *
 * This is the original v1 drawing with its joints cleaned so it holds up at
 * any size: the lid starts on the body's centre line along the shoulder's own
 * tangent, so it swells out of the body with no step; the spout and handle
 * meet the body square-on with their round caps inside its stroke; and the
 * knob is a solid dot rather than a ring.
 */

/** One weight of the drawing, in a 64-unit square. */
export type Weight = {
  strokes: string[];
  knob: { cx: number; cy: number; r: number };
  width: number;
  /** Visual bounds including stroke: [left, top, right, bottom]. */
  box: [number, number, number, number];
};

// Body: flat-shouldered and round-bellied, as in v1.
const BODY = "M14 36c0-10 8-15 18-15s18 5 18 15c0 10-7 16-18 16S14 46 14 36Z";
// Lid: swells 1.5 units above the shoulder, tangent to it at both ends.
const LID = "M20.9 23.64C23.5 22.14 27 19.5 32 19.5S40.5 22.14 43.1 23.64";
// Spout: rises from the left flank.
const SPOUT = "M13.7 38C9 37 6.5 32 6 25";

/** The everyday weight: page mark and favicon. */
export const regular: Weight = {
  // Handle: a loop off the right flank, arriving square to the body.
  strokes: [BODY, LID, SPOUT, "M48.87 30C57 28 58.5 46.5 48.19 43.87"],
  knob: { cx: 32, cy: 15, r: 3.4 },
  width: 3.5,
  box: [4.25, 11.6, 57.4, 53.75],
};

/**
 * A heavier weight for sitting among bold shapes, like a QR code's modules.
 * Its handle opens wider and its knob grows and rises, so neither fills in.
 */
export const bold: Weight = {
  strokes: [BODY, LID, SPOUT, "M48.87 30C62 26 63 49 48.19 43.87"],
  knob: { cx: 32, cy: 13, r: 4.6 },
  width: 6,
  box: [3, 8.4, 62.1, 55],
};

/** The drawing in `ink`, scaled to fill the 64 square less `margin`. */
function drawing(ink: string, w: Weight, margin: number): string {
  const [x0, y0, x1, y1] = w.box;
  const scale = (64 - 2 * margin) / Math.max(x1 - x0, y1 - y0);
  const paths = w.strokes.map((d) => `<path d="${d}"/>`).join("");
  return (
    `<g transform="translate(32 32) scale(${scale.toFixed(4)}) ` +
    `translate(${-(x0 + x1) / 2} ${-(y0 + y1) / 2})">` +
    `<g fill="none" stroke="${ink}" stroke-width="${w.width}" ` +
    `stroke-linecap="round" stroke-linejoin="round">${paths}</g>` +
    `<circle cx="${w.knob.cx}" cy="${w.knob.cy}" r="${w.knob.r}" ` +
    `fill="${ink}"/></g>`
  );
}

/** The mark on a rounded tile, for the favicon. */
export function iconSvg(tile: string, ink: string): string {
  const favicon = { ...regular, width: regular.width + 0.5 };
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="14" fill="${tile}"/>` +
    drawing(ink, favicon, 8) +
    `</svg>`
  );
}

/** The mark alone on a transparent square, e.g. for a QR code's centre. */
export function markSvg(ink: string, weight: Weight): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    drawing(ink, weight, 2) +
    `</svg>`
  );
}
