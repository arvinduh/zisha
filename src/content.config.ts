/**
 * Content schemas: every page on the site is rendered from these collections.
 *
 * Procedures (rituals, tea brewing, fixes) are structured YAML so each step
 * keeps its one-line instruction, how-to, and reasoning separate; long-form
 * reading lives in Markdown. Adding a tea or an article is adding a file.
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Inclusive numeric range written as `[low, high]`. */
const range = z.tuple([z.number(), z.number()]);

/**
 * One step of a procedure.
 *
 * `do` is the always-visible instruction (the cheat-sheet line), `how` the
 * short practical detail, `why` the reasoning folded away for the curious,
 * and `warn` a safety note that is never hidden. `timer` is in seconds.
 */
const step = z.object({
  do: z.string(),
  how: z.string().optional(),
  why: z.string().optional(),
  warn: z.string().optional(),
  timer: z.number().int().positive().optional(),
});

const rituals = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/rituals" }),
  schema: z.object({
    title: z.string(),
    hanzi: z.string(),
    summary: z.string(),
    needs: z.array(z.string()).default([]),
    steps: z.array(step),
  }),
});

const teas = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/teas" }),
  schema: z.object({
    name: z.string(),
    hanzi: z.string(),
    summary: z.string(),
    vessel: z.object({ name: z.string(), ml: range }),
    grams: range,
    ratio: z.number().positive(),
    tempC: range,
    infusions: z.object({
      /** Steep window in seconds for the first `fixed` infusions. */
      base: range,
      fixed: z.number().int().positive(),
      /** Seconds added per infusion after `fixed`, as a window. */
      add: range,
      total: range,
    }),
    prepare: z.array(step),
    infuse: z.array(step),
    source: z.string(),
  }),
});

/**
 * Loads `src/content/<name>.yaml` as one entry holding an ordered `items`
 * list, so the page shows items in file order (per-item entries get sorted
 * by id instead).
 */
const list = (name: string) =>
  glob({ pattern: `${name}.yaml`, base: "./src/content" });

const set = defineCollection({
  loader: list("set"),
  schema: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        hanzi: z.string(),
        inBox: z.boolean(),
        what: z.string(),
        use: z.string(),
        care: z.string().optional(),
      }),
    ),
  }),
});

const rules = defineCollection({
  loader: list("rules"),
  schema: z.object({
    items: z.array(z.object({ id: z.string(), rule: z.string(), why: z.string() })),
  }),
});

const fixes = defineCollection({
  loader: list("fixes"),
  schema: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        symptom: z.string(),
        urgency: z.enum(["stop", "soon", "fine"]),
        steps: z.array(z.string()),
        why: z.string().optional(),
      }),
    ),
  }),
});

/** A bold line that stands alone, with its reason for Full mode. */
const note = z.object({ rule: z.string(), why: z.string() });

/** Keeping the pot and the tea between sessions. */
const storage = defineCollection({
  loader: list("storage"),
  schema: z.object({ pot: z.array(note), tea: z.array(note) }),
});

/** Background reading, embedded in pages. */
const learn = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/learn" }),
  schema: z.object({ title: z.string(), hanzi: z.string() }),
});

/** Definitions behind every Chinese term's tooltip. */
const glossary = defineCollection({
  loader: list("glossary"),
  schema: z.object({
    items: z.array(
      z.object({
        hanzi: z.string(),
        pinyin: z.string(),
        meaning: z.string(),
        words: z.array(z.string()).default([]),
      }),
    ),
  }),
});

export const collections = {
  rituals,
  teas,
  set,
  rules,
  fixes,
  learn,
  glossary,
  storage,
};
