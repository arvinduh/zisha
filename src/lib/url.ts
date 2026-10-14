/**
 * Base-aware internal links.
 *
 * The site is served from a sub-path on GitHub Pages; this module is the one
 * place that knows about it, so pages never hand-write the prefix.
 */

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefixes a site-relative path (`"brew/"`) with the deployment base. */
export function href(path: string): string {
  return `${base}/${path.replace(/^\//, "")}`;
}
