# Design

How the site is shaped, and why. The About page on the site shows the
palette and type to visitors; this file records the reasoning.

## Journey first

The site is designed backwards from three moments with the pot:

| Moment | Posture | Page |
| --- | --- | --- |
| **Day one** | Curious, reading on a phone | Start: the first read, with a day-one path of links |
| **Once** | At the counter, wet hands | Wake up the pot |
| **Every session** | Both hands busy, hot water | The tea's page: numbers, steps, timer |
| **Every day after** | Cleaning up, storing | Daily care: rules, after every session, storing |
| **When something's off** | Worried | Something wrong? |
| **Over the years** | Curious | The long run: patina, heat, and cracks |

Each fact lives on exactly one page and is linked from the others; content
files link with `[label](/path/#section)`.

### Two depths, one switch

The menu holds a single site-wide **Full / Mini** switch, remembered on the
device. Full (the default) runs each step's how-to and reasons on after its
bold lead, and adds the long reads (zisha clays, patina, heat and cracks, the
tea's story). Mini shows only the bold leads and warnings: what someone wants
once they know the ritual.

Rules that hold in both modes:

- Warnings never hide.
- Interactive parts (tick rings, the 20-minute timer, the steep timer) are
  identical, so habits carry over.
- The mode is applied before first paint; switching animates with a view
  transition.

## Navigation

One place: a dot in the bottom-left corner. On desktop, hovering it grows a
soft halo and stretches its shorter line to full width. Tapping it opens a
panel with a circular reveal out of the dot (espresso to linen), its contents
rising in one after another, and a light blur that fades out from that
corner. The close button sits exactly where the dot was. Contents: the
Full / Mini switch, then **Start** and each tea, then a small **Care** label
over its four pages, and *About this site* in the footer. With this few pages
a flat, grouped list beats collapsible submenus: everything is one tap away. Built on the Popover API, so dismissal (tap outside, Esc)
needs no script.

On arrival, a page's first blocks rise in over about a third of a second;
after that, reading is still. Between pages the dot holds its place.

On a tea page, the steep timer sits beside the dot as a pill: steep number
with ‹ ›, target seconds, play. It fills with pale liquor as the tea steeps,
turns honey with "Pour" when done, chimes, vibrates, keeps the screen awake,
and remembers the steep for six hours.

### Definitions in place

There's no glossary page. Every piece of Chinese text, and the first use per
section of words like *gaiwan*, *duanni*, or *patina*, carries a dotted honey
underline; hovering (desktop) or tapping (phone) shows the characters, pinyin,
and meaning in a small card. The markup is added at build time from
`glossary.yaml`, and the build warns about Chinese text with no entry.

## Visual language

Quiet, premium, paper-and-ink. Eight colours, all in use, defined once in
`src/lib/palette.ts`; tints (the timer's fill) are mixed from them in CSS.

| Token | Name | Hex | Job |
| --- | --- | --- | --- |
| `bg` | Oat | `#F3ECE1` | The page |
| `surface` | Linen | `#FAF6F0` | Menu, timer, marks on espresso |
| `line` | Hairline | `#E2D6C6` | Dividers |
| `muted` | Taupe | `#74655A` | Meta text (4.7:1 on Oat) |
| `ink` | Walnut | `#3B2E25` | All text (11:1 on Oat) |
| `espresso` | Espresso | `#2F241D` | The things you press |
| `honey` | Honey | `#C8A46E` | Progress, numbers, links, section rules |
| `terracotta` | Terracotta | `#9A4E36` | Warnings only |

Type: [Crimson Pro](https://fonts.google.com/specimen/Crimson+Pro) for
everything, self-hosted at build time; the system Song serif for hanzi.
Hierarchy has distinct roles rather than near-identical sizes:

| Role | Treatment |
| --- | --- |
| Title | 54px, regular, tight tracking |
| Subtitle | 22px taupe, under the title |
| Section | 30px regular, with a short honey rule above |
| Sub-section | 20px semibold (long reads only) |
| Body | 20px / 1.6, steps and rules led by a bold run-in sentence |
| Meta | 17px italic taupe, for asides only |

The teapot mark (`src/lib/teapot.ts`) is drawn so every stroke meets the body
at a steep angle and ends on its centre line, which keeps it clean from 16px
favicon to page mark.

## Content model

`src/content.config.ts` validates every file at build time.

- `rituals/*.yaml`: first use, after every session.
- `teas/*.md`: numbers and steps in frontmatter, the story in the body.
- `set.yaml`, `rules.yaml`, `fixes.yaml`: ordered lists.
- `learn/*.md`: long reads, embedded in Full mode.
- `glossary.yaml`: the tap/hover definitions.

## Publishing

The deploy workflow asks GitHub Pages for the repo's default address
(`actions/configure-pages`) and builds with that origin and path, so links
always match `https://arvinduh.github.io/zisha/`. Locally both are unset and
the site serves from `/`.

## The gift's specifics

The set is a handmade **zhuni** pot (capacity unknown, in its own case), a
gaiwan, a fairness pitcher, two cups, and Bai Mudan. So:

- **The zhuni pot is the Bai Mudan's.** Zhuni is classically an oolong clay,
  but it absorbs the least, keeping a white tea's aroma clean; its heat is
  managed with 90 °C water, short steeps, and the lid off between steeps.
  Every other tea goes in the gaiwan.
- **Zhuni is the most heat-sensitive clay**, so warming in two stages
  (lukewarm 90 s, hot 30-45 s) opens every brew.
- **The seller's advice wins** where it differs from general guides: air-dry
  with the lid off and no towel; a fingernail on the hot lid when pouring.
- **Leaf is by ratio** (1 g per 30 ml), since the pot's size is measured once
  with water and a measuring cup.
- **The case** gets its own care step: the pot goes back only when bone-dry.

## Research and sources

Care guidance follows the pot maker's guides first, filled in from other
established sellers where those are silent:

- DXY Zisha: [Use & care](https://dxyzisha.com/use-care-guide),
  [Patina & maintenance](https://dxyzisha.com/patina-maintenance),
  [Thermal shock safety](https://dxyzisha.com/thermal-shock-safety),
  [One pot, one tea](https://dxyzisha.com/one-pot-one-tea),
  [Tea pairing](https://dxyzisha.com/tea-pairing-guide),
  [FAQ](https://dxyzisha.com/faq)
- Wan Ling Tea House: [Zisha preparation and care](https://www.wanlingteahouse.com/blogs/tea-articles/zisha-teapots-yixing-teapot-preparation-care)
- Path of Cha: [Caring for a Yixing teapot](https://pathofcha.com/blogs/all-about-tea/taking-care-of-your-yixing-teapot-5-easy-steps)
- Gaiwan handling: [Teasenz](https://teasenz.eu/blogs/tea-magazine/how-to-brew-use-pour-with-a-gaiwan),
  [CUNY tea set guide](https://pressbooks.cuny.edu/teaset/chapter/step-by-step-how-to-use-a-gaiwan-without-burning-your-fingers)
- Bai Mudan: [Yunnan Sourcing](https://yunnansourcing.com/en-gb/collections/new-products/products/fuding-white-peony-bai-mu-dan-white-tea),
  [Tea Guardian](https://www.teaguardian.com/?p=1526),
  [Meileaf aging study](https://meileaf.com/p/tea-wpac/)

### Where sources disagree

- **Seasoning:** DXY's gentle 80 °C soak, then tea and boiling water left to
  cool, rather than a rolling boil (crack risk) or tofu and sugarcane recipes
  (mold risk).
- **Water temperature:** DXY's generic chart says 80-85 °C for white teas;
  the seller's card for this Bai Mudan says 90-95 °C. The tea-specific card
  wins, at its low end (90 °C) because zhuni holds heat.
- **Drying:** DXY polishes the warm pot with a cotton cloth; this pot's seller
  says air-dry, lid off, no towel. The seller wins.
- **Rinse:** many guides "wash" the leaves first; the seller says no long
  rinse.
- **Aging Bai Mudan:** vendors encourage it, Tea Guardian is skeptical; the
  tea page presents both.
