/**
 * Gongfu brewing math: how much leaf for a pot, and the steep schedule for
 * the steep timer.
 */

/** Common gongfu pot sizes offered in the pot-size setting, in ml. */
export const POT_SIZES = [80, 100, 120, 150];

/** Until the pot is measured, assume the seller's card's 120 ml vessel. */
export const DEFAULT_POT_ML = 120;

/** Leaf for a pot of `ml` at 1 g per `ratio` ml, to the half gram: "4 g". */
export function leaf(ml: number, ratio: number): string {
  return `${Math.round((ml / ratio) * 2) / 2} g`;
}

/** A tea's steep schedule as authored in its frontmatter. */
export type Schedule = {
  base: [number, number];
  fixed: number;
  add: [number, number];
};

/** Steep window in seconds for 1-based infusion `n`. */
export function steepWindow(s: Schedule, n: number): [number, number] {
  const extra = Math.max(0, n - s.fixed);
  return [s.base[0] + extra * s.add[0], s.base[1] + extra * s.add[1]];
}

/** The timer's target: the middle of the window, in whole seconds. */
export function target([lo, hi]: [number, number]): number {
  return Math.round((lo + hi) / 2);
}
