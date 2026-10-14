# Zisha

A small, phone-first guide for a handmade Yixing zisha teapot, its tea set
(gaiwan, pitcher, two cups), and Bai Mudan tea.

Live at **https://arvinduh.github.io/zisha/** once published (see below).
Design rationale and research sources: [docs/design.md](docs/design.md).

## Run it locally

Needs Node 22.12+.

```bash
npm install
npm run dev
```

Open http://localhost:4321/. To try it on your phone, run
`npm run dev -- --host` and open the network URL it prints, from the same
Wi-Fi.

`npm run build` type-checks and builds to `dist/`; `npm run preview` serves
that build.

### Local `/` vs. the Pages address

GitHub Pages serves this repo at its default address,
`https://arvinduh.github.io/zisha/`. The deploy workflow asks Pages for that
path (`actions/configure-pages`) and builds with it, so every link carries the
`/zisha/` prefix. Locally there's no prefix and the site lives at `/`.

To check the Pages-shaped build before pushing (works in any shell):

```bash
npm run preview:pages
```

Then open http://localhost:4321/zisha/. Internal links in templates must go
through `href()` from `src/lib/url.ts` so they pick up the prefix.

## The site

One menu (the dot, bottom left) with a site-wide **Full / Mini** switch:

| Page | URL | What's on it |
| --- | --- | --- |
| Start | `/` | The first read: day-one path, the set, the clay |
| Bai Mudan | `/tea/bai-mudan/` | Brewing steps and the steep timer |
| Wake up the pot | `/care/wake-up/` | One-time seasoning |
| Daily care | `/care/daily/` | The rules, after every session, storing |
| Something wrong? | `/care/fix/` | Fixes by symptom |
| The long run | `/care/long-run/` | Patina, heat, and cracks |
| About this site | `/about/` | Who it's for, the palette, and the type |

Each fact lives on exactly one page; everywhere else links to it. Full (the
default) adds every step's reasons; Mini shows just the steps.

Chinese text, and words like *gaiwan* or *patina*, show a definition on hover
(desktop) or tap (phone).

## Editing content

Everything comes from `src/content/`. Edit, save, and the dev server reloads.
Lists show in file order.

| File | Shows up |
| --- | --- |
| `set.yaml` | Start → Your set |
| `learn/zisha.md` | Start, Full only |
| `teas/bai-mudan.md` | The tea page: numbers and steps up top, the story in the body |
| `rituals/first-use.yaml` | Wake up the pot |
| `rules.yaml` | Daily care → The rules |
| `rituals/after-session.yaml` | Daily care → After every session |
| `storage.yaml` | Daily care → Storing |
| `fixes.yaml` | Something wrong? |
| `learn/patina.md`, `learn/heat-and-cracks.md` | The long run |
| `glossary.yaml` | The tap/hover definitions |

Link to another page from any text with `[label](/care/daily/#rules)`; the
`/zisha/` prefix is added for you.

Colours live in `src/lib/palette.ts` and the teapot drawing in
`src/lib/teapot.ts`; the CSS, the About page, and the generated favicon all
read from them. The name on the About page is set at the top of
`src/pages/about.astro`.

Any Chinese text needs an entry in `glossary.yaml`; the build prints a
`[glossary]` warning if one is missing.

### Writing a step

```yaml
- do: Pour the water down the inside wall.  # always shown, in bold
  how: Circle the stream down the side...   # Full only, runs on after it
  why: A direct hit scalds the leaves...    # Full only, runs on after that
  warn: Never onto the leaves directly.     # always shown, in terracotta
  timer: 1200                               # optional inline timer, in seconds
```

Only `do` is required.

### Adding a tea

Copy `teas/bai-mudan.md` to `teas/<new-id>.md` and change the numbers and
steps. It gets its own page at `/tea/<new-id>/` and a line in the menu. The
steep timer follows `infusions`:

```yaml
infusions: { base: [5, 8], fixed: 5, add: [4, 6], total: [20, 25] }
# steeps 1-5 last 5-8 s; each one after adds 4-6 s; 20-25 in total
```

## Publishing to GitHub Pages

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.

One-time setup:

1. Point the repo at GitHub:

   ```bash
   git remote add origin https://github.com/arvinduh/zisha.git
   ```

2. Switch Pages to deploy from Actions, either in **Settings → Pages → Build
   and deployment → Source: GitHub Actions**, or:

   ```bash
   gh api -X POST repos/arvinduh/zisha/pages -f build_type=workflow
   ```

3. Commit and push `main`. The **Actions** tab shows the build; when it's
   green the site is live at https://arvinduh.github.io/zisha/.

After that, publishing is just: edit, commit, push.

## QR code for the card

`brand/qr-icon.png` (1024 px, transparent) and `brand/qr-icon.svg` are the
site's teapot mark in a bold weight, in espresso, for the middle of the code. Colours to match
the site:

| Part | Colour |
| --- | --- |
| Background | Oat `#F3ECE1` |
| Dots | Espresso `#2F241D` (13:1 against Oat) |
| Corner squares | Espresso `#2F241D` |
| Corner dots | Espresso `#2F241D`, or Terracotta `#9A4E36` (5:1) for one accent |

Set error correction to High, keep the logo under about a fifth of the code's
width with a clear margin around it, and leave a quiet border of Oat around
the code. Don't use Honey, Taupe, or Hairline for any part of the code itself;
they're too light to scan reliably. Scan a test print with a phone before the
final print.

## Notes

- Progress (ticks, current steep, Full / Mini) lives in the browser's local
  storage on that device, well under 1 KB. Nothing is sent anywhere.
- The site is public, so keep personal messages on the physical card. A QR
  code on the card pointing to the URL above makes the hand-off seamless.
