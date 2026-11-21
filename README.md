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

## Content notes

- **Stack.** `stack` in `src/data.ts`; each `icon` is a [simple-icons](https://simpleicons.org) slug, rendered at build time. The bar next to each tool counts the projects in `projects` whose `stack` lists it.
- **Experience photos.** `photos` takes several images; the timeline's detail panel turns them into a swipeable strip.
- **Timeline.** `experience` entries carry `from`/`to` as `YYYY-MM`; equal values draw a point.
- **Portrait.** `src/assets/portrait-photo.jpg` is the full photo; `portrait-closeup.png` is a head-and-shoulders crop of the same original with the background removed (made with `rembg`). The ASCII is drawn from the close-up, the photo underneath is zoomed onto that crop, and developing zooms out to the full photo. The crop rectangle lives in `src/components/AsciiPortrait.astro`; change it together with the close-up image.
- **CV.** `python scripts/render-cv.py path/to/CV.pdf` copies the PDF to `public/` and renders `src/assets/cv/page-N.png`. Then bump `resume.version` in `src/data.ts`.
- **Old URLs.** `/about`, `/work`, `/experience`, `/contact` redirect to the matching section on `/`. See `astro.config.mjs`.

## Environment

Optional, set in Vercel:

- `GITHUB_TOKEN`: raises the GitHub API rate limit. The route works without it.
- `GITHUB_USERNAME`: defaults to `gnatnib`.
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`: the "last played / on repeat" strip in the About section. The refresh token needs the scopes `user-read-currently-playing user-read-recently-played user-top-read` (get one with `npm run spotify:token`). Without working credentials the strip hides itself.
