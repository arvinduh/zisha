/**
 * Namespaced JSON wrapper over `localStorage` for per-device progress.
 *
 * Storage can be missing or throw (private mode, blocked site data); every
 * caller must render correctly when reads come back `null`.
 */

const prefix = "zisha:";

/** Reads a stored value, or `null` when absent or unreadable. */
export function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(prefix + key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

/** Stores a value; silently does nothing when storage is unavailable. */
export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(prefix + key, JSON.stringify(value));
  } catch {
    // Progress is a convenience; the page works without it.
  }
}
