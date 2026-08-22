# Bhukya Jithendar Nayak — Portfolio

Portfolio for **Bhukya Jithendar Nayak**, graphic & motion designer.
Black glass UI, motion-driven, and **entirely folder-driven** — you add files, the site updates.

```
React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Motion · Lenis · React Router
```

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # production build -> dist/
npm run preview      # preview the build locally
npm run content      # re-scan public/portfolio (dev + build do this for you)
npm run typecheck    # tsc --noEmit
```

---

## Adding your work — no code required

Everything under `public/portfolio/` becomes the site. Drop a file in, and it's live.

```
public/portfolio/
├── 01 Posters/                  ← COLLECTION: a card on the home page + its own page
│   ├── Original Creations/      ← SECTION: a titled group inside that page
│   │   ├── Neon Fest.jpg        ← ITEM: caption reads "Neon Fest"
│   │   └── 02 Retro Night.png   ← caption "Retro Night", sorted second
│   └── Client Work/
├── 02 Thumbnails/
│   ├── Original Creations/
│   └── Recreated Work/
├── 03 Motion Graphics/
└── 04 Videos/
```

| What you do | What happens |
| --- | --- |
| Create a top-level folder | A new collection card + its own page at `/#/work/<slug>` |
| Create a sub-folder | A new titled section inside that collection |
| Drop in an image or video | A new tile, captioned with the file name |
| Prefix with `01 `, `02 ` | Controls the order; the number is stripped from the title |
| Name it `neon-fest.jpg` | Caption becomes "Neon Fest" (dashes/underscores → spaces) |
| Leave a folder empty | It's skipped, so nothing looks broken while you fill it |

The dev server watches these folders — add a file while `npm run dev` is running and the
page reloads on its own.

### How mixed aspect ratios are laid out

Collection pages use a **justified-rows** gallery. Each row is packed to the full
container width at one shared height, and every frame is given the image's real
aspect ratio — so a wide banner takes the space of two or three thumbnails, a
portrait flyer takes less, and nothing is cropped or letterboxed.

That means you can drop any mix of formats into one folder and it still reads as
a designed grid:

| Format | Ratio | Behaviour |
| --- | --- | --- |
| YouTube thumbnail | 16:9 | Three per row on desktop |
| Instagram post | 1:1 | Narrower than a 16:9 at the same height |
| Instagram story / reel | 9:16 | Narrow and tall |
| Web banner | 3:1 – 5:1 | Spans most or all of a row |
| A4 flyer / poster | 1:1.41 | Sits beside wider pieces without towering |

Row height adapts to the viewport (240px on phones, 270px on desktop), and the
layout recalculates on resize. On phones most images get their own full-width row.
Ratios beyond 5:1 or 1:2.4 are letterboxed rather than allowed to distort the row.

The toggle beside the section filters switches between this **adaptive** layout and
a **uniform** grid of equal 16:10 cells, if you ever want everything the same size.

### Supported files

- **Images** — `.jpg` `.jpeg` `.png` `.webp` `.avif` `.gif` `.svg`
- **Video** — `.mp4` `.webm` `.mov` `.m4v`

Give a video a matching image name and it becomes the cover frame:

```
Brand Reel.mp4
Brand Reel.jpg      ← used as the poster, not shown as its own tile
```

### Optional: `_meta.json`

Drop this into any collection or section folder to override the generated text.
Everything in it is optional.

```json
{
  "title": "Poster Art",
  "tagline": "Print & social",
  "description": "Sits under the collection title.",
  "order": 1,
  "items": {
    "Neon Fest.jpg": {
      "title": "Neon Fest 2025",
      "description": "Event key visual",
      "tags": ["Print"]
    }
  }
}
```

### Optional: `_links.json`

For video that lives on YouTube or Vimeo instead of in the repo — handy when the
source files are too large to commit.

```json
[
  { "title": "Brand Film", "url": "https://youtu.be/VIDEO_ID" },
  { "title": "Client Reel", "url": "https://vimeo.com/123456789", "thumbnail": "cover.jpg" }
]
```

YouTube covers are pulled automatically; no thumbnail needed.

---

## Editing the written content

All copy, skills, tools and links live in one file: **[`src/data/site.ts`](src/data/site.ts)**

| Section | What to change |
| --- | --- |
| Name, role, intro, email, socials | `site` |
| Hero ticker words | `marqueeWords` |
| The pull quote in About | `site.quote` |
| Design skills (title, level, strength, blurb, detail, deliverables) | `skills` |
| Software (name, badge letters, brand colour) | `tools` |
| Fallback text per collection | `categoryCopy` |

Skill icons come from `src/components/Icons.tsx` — add an SVG there and reference its key.

Typography is **Montserrat** (display) and **Poppins** (body).
Colours, fonts, radii and easing curves are tokens at the top of
**[`src/styles/index.css`](src/styles/index.css)** (`@theme`). Change `--color-ember-500`
and the whole site re-skins.

Replace `public/assets/img/profile.png`, `public/assets/img/about.jpg` and
`public/assets/docs/Resume.pdf` with your own — same file names, no code change.

---

## Project structure

```
scripts/generate-content.mjs   The folder scanner — turns public/portfolio into JSON
src/generated/content.json     Generated. Never edit by hand.
src/data/site.ts               All written content
src/lib/content.ts             Reads the manifest, shapes it for the UI
src/lib/justify.ts             Justified-rows gallery maths (mixed aspect ratios)
src/lib/hooks.ts               Spotlight, scroll-lock, active-section, count-up
src/components/                Nav, Cursor, Lightbox, WorkCard, Preloader, glass primitives
src/sections/                  Hero, FeaturedStrip, About, Expertise, Work, Contact
src/pages/                     Home, CategoryPage, NotFound
public/portfolio/              ← YOUR WORK GOES HERE
public/assets/                 Portrait, résumé, misc images
```

---

## Deploying

The build uses a **relative base** and **hash routing**, so `dist/` works from any static
host and from any sub-folder — no server rewrites, no `basePath` config.

- **GitHub Pages** — push to `main`; the included workflow at
  `.github/workflows/deploy.yml` builds and publishes. Enable Pages → Source →
  *GitHub Actions* once, in the repo settings.
- **Netlify / Vercel / Cloudflare Pages** — build command `npm run build`, publish
  directory `dist`.
- **Anything else** — upload the contents of `dist/`.

---

## Notes

- Respects `prefers-reduced-motion`: smooth scroll, the intro, parallax and the marquees
  all switch off.
- Magnetic hover is disabled on touch devices; the pointer stays the native system cursor
  everywhere.
- Image dimensions are read at build time, so the gallery can lay rows out before
  a single file has downloaded — no shifting while images load.
