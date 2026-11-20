# gnatnib.site

Personal site of Bintang Syafrian Rizal. Astro 6, static HTML with one on-demand route, deployed on Vercel.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output in .vercel/output
npm run check    # astro check (types)
```

Node 22.12 or newer.

## Layout

| Path | What |
|---|---|
| `src/data.ts` | All content: projects, experience, certificates, bio sentences, links. Edit here first. |
| `src/pages/index.astro` | Home: hero, about, work, experience, activity, credentials, contact. |
| `src/pages/resume.astro` | CV rendered as page images, plus the PDF download. |
| `src/pages/api/github.ts` | Live GitHub calendar and recent repos. Cached at the edge for an hour. |
| `src/scripts/motion.ts` | Lenis smooth scroll, GSAP ScrollTrigger wiring, section tone, line reveals. |
| `src/scripts/ascii.ts` | The ASCII portrait: glyph grid, cursor lens, click to develop. |
| `src/lib/textrank.ts` | TextRank used by the About section, run at build time. |

## Content notes

- **About section.** `bioSentences` in `src/data.ts` is ranked with TextRank when the site builds. The top `SUMMARY_KEEP` sentences stay highlighted; the scores on the page are the real output.
- **Portrait.** `src/assets/portrait-photo.jpg` is the photo, `portrait-cutout.png` the same crop with the background removed (made with `rembg`). The canvas samples the cutout; the photo sits underneath.
- **CV.** `python scripts/render-cv.py path/to/CV.pdf` copies the PDF to `public/` and renders `src/assets/cv/page-N.png`. Then bump `resume.version` in `src/data.ts`.
- **Old URLs.** `/about`, `/work`, `/experience`, `/contact` redirect to the matching section on `/`. See `astro.config.mjs`.

## Environment

Optional, set in Vercel:

- `GITHUB_TOKEN`: raises the GitHub API rate limit. The route works without it.
- `GITHUB_USERNAME`: defaults to `gnatnib`.
