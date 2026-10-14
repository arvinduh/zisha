/**
 * Build-time markup for content text: glossary tooltips and internal links.
 *
 * Every Chinese term is wrapped in a `.term` button (explained by the Tooltip
 * component) wherever it appears; an English or pinyin alias only on its
 * first appearance per annotator, so prose isn't peppered with underlines.
 * Chinese text with no definition warns at build time.
 *
 * Plain-text content may link with `[label](/path/#section)`; site-absolute
 * paths, in that syntax or in Markdown links, get the deployment base, so
 * each fact can live in one place and be linked from the rest.
 */
import { getEntry } from "astro:content";
import { href } from "./url";

type Term = { hanzi: string; pinyin: string; meaning: string };

/** Marks up plain text or an HTML fragment. */
export type Annotator = {
  /** Escapes `plain`, turns `[label](/path)` into links, wraps its terms. */
  text(plain: string): string;
  /** Wraps terms in the text nodes of `html` and bases its internal links. */
  html(fragment: string): string;
};

const CJK = /[㐀-鿿]/;
const SKIP = /^<(\/?)(a|button|code|script|style)\b/i;
const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
const INTERNAL_HREF = /(<a\b[^>]*\bhref=")\/(?!\/)/;
const UNIT_GAP = /(\d) (?=°C|ml\b|g\b|s\b|seconds\b|minutes\b|hours\b)/g;

const escape = (s: string): string =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const source = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type Compiled = { pattern: RegExp; lookup: Map<string, Term> };
let shared: Promise<Compiled> | null = null;

/** Builds one alternation pattern over every term and alias. */
async function build(): Promise<Compiled> {
  const entry = await getEntry("glossary", "glossary");
  const lookup = new Map<string, Term>();
  for (const { words, ...term } of entry!.data.items) {
    lookup.set(term.hanzi, term);
    for (const word of words) lookup.set(word.toLowerCase(), term);
  }
  const keys = [...lookup.keys()].sort((a, b) => b.length - a.length);
  const hanzi = keys.filter((k) => CJK.test(k)).map(source);
  const words = keys.filter((k) => !CJK.test(k)).map(source);
  const pattern = new RegExp(
    `(${hanzi.join("|")})|\\b(${words.join("|")})\\b`,
    "gi",
  );
  return { pattern, lookup };
}

/** Compiles the glossary once per build. */
function compile(): Promise<Compiled> {
  shared ??= build();
  return shared;
}

/** Creates an annotator whose word aliases are underlined once each. */
export async function annotator(): Promise<Annotator> {
  const { pattern, lookup } = await compile();
  const seen = new Set<Term>();

  const wrap = (raw: string): string => {
    // Keep a number with its unit on one line ("90 °C", "4 g", "30 ml").
    const chunk = raw.replace(UNIT_GAP, "$1 ");
    const leftover = chunk.replace(pattern, "");
    if (CJK.test(leftover)) {
      console.warn(`[glossary] no definition for Chinese text in: ${chunk}`);
    }
    return chunk.replace(pattern, (match, hz: string | undefined) => {
      const term = lookup.get(hz ?? match.toLowerCase())!;
      if (!hz) {
        if (seen.has(term)) return match;
        seen.add(term);
      }
      return (
        `<button type="button" class="term" data-hz="${escape(term.hanzi)}" ` +
        `data-py="${escape(term.pinyin)}" data-def="${escape(term.meaning)}">` +
        `${match}</button>`
      );
    });
  };

  return {
    text(plain) {
      let out = "";
      let last = 0;
      const escaped = escape(plain);
      for (const m of escaped.matchAll(LINK)) {
        out += wrap(escaped.slice(last, m.index));
        out += `<a href="${href(m[2]!)}">${m[1]}</a>`;
        last = m.index + m[0].length;
      }
      return out + wrap(escaped.slice(last));
    },
    html(fragment) {
      let depth = 0;
      return fragment
        .split(/(<[^>]*>)/)
        .map((part) => {
          const tag = SKIP.exec(part);
          if (tag) depth += tag[1] ? -1 : 1;
          if (part.startsWith("<")) {
            return part.replace(INTERNAL_HREF, (_, open: string) => open + href(""));
          }
          return depth > 0 ? part : wrap(part);
        })
        .join("");
    },
  };
}
