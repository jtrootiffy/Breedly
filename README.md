# Breedly

**Better knowledge. Healthier, happier dogs.**

Breedly is a responsive dog breed health explorer built on the public
[Breed Health Score](https://breedhealthscore.com) dataset. Browse all breeds, compare health
scores and median lifespans, and read the hereditary conditions the dataset lists for each breed.

- React + Vite + TypeScript
- Tailwind CSS v4 for styling
- Lucide React for icons
- React Router for routing
- No backend, no database, no API key, no environment variables required

---

## Features

- **Landing page** — hero, "Know What Matters" feature cards, a "Find Your Perfect Companion"
  call to action, and the breed-level disclaimer.
- **Breed explorer** (`/breeds`) — live data from the API with search, size / grade / brachycephalic
  filters, six sort orders, clear-all, loading skeletons, empty state, error state with retry, and
  "Load more" pagination.
- **Breed details** (`/breeds/:slug`) — fetched from the detail endpoint using the breed's real
  slug, showing the score gauge, grade, median lifespan, size, brachycephalic status, weight, listed
  conditions, the weighted score components, image credit, and previous/next breed navigation.
- **Compare** (`/compare`) — pick two or three breeds and compare health score, grade, lifespan,
  size, brachycephalic status, listed conditions and severe-condition counts. The selection is saved
  in `localStorage` and can be toggled from any breed card or detail page.
- **Health score visualisation** — an accessible circular gauge plus horizontal meters for the
  score components. Missing values are shown as "Not available"; nothing is fabricated.
- **Accessibility** — keyboard-navigable controls, visible focus rings, skip link, ARIA labels and
  `role="meter"`/`role="img"` semantics with the value always printed as text.

---

## Getting started

Requirements: **Node.js 20.19+** (or 22.12+) and npm.

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
npm run build   # type-check and build to dist/
npm run preview # serve the production build locally
npm run lint    # run oxlint
```

### Scripts

| Script            | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                              |
| `npm run build`   | `tsc -b` then `vite build` into `dist/`               |
| `npm run preview` | Serves the built `dist/` with the API proxy enabled   |
| `npm run lint`    | Runs oxlint                                           |

---

## API integration

| Endpoint | Purpose |
| -------- | ------- |
| `GET https://breedhealthscore.com/api/breeds.json` | Full catalog (155 breeds) |
| `GET https://breedhealthscore.com/api/v1/breeds/{slug}.json` | Single breed detail |
| `GET https://breedhealthscore.com/api/v1/openapi.json` | API schema discovery |
| `GET https://breedhealthscore.com/api/v1/index.json` | API discovery |

All API access lives in [`src/services/api.service.ts`](src/services/api.service.ts).

### Why requests go through `/api/bhs`

The upstream API answers plain HTTP requests but **does not send an `Access-Control-Allow-Origin`
header**, so a browser blocks a direct cross-origin `fetch` from `localhost` or from a deployed
domain (CORS error). Verified with:

```bash
curl -s -D - -o /dev/null -H "Origin: https://example.com" \
  https://breedhealthscore.com/api/breeds.json | grep -i access-control
# -> no Access-Control-Allow-Origin header
```

So the frontend calls a **same-origin** prefix, `/api/bhs/*`, which is forwarded to the real API:

- **Local development / preview** — the proxy in [`vite.config.ts`](vite.config.ts)
- **Production (Vercel)** — the rewrite in [`vercel.json`](vercel.json)

Mapping:

```
/api/bhs/breeds.json             -> https://breedhealthscore.com/api/breeds.json
/api/bhs/v1/breeds/{slug}.json   -> https://breedhealthscore.com/api/v1/breeds/{slug}.json
```

The upstream remains the single source of truth — there is **no mock data and no backend**. Set
`VITE_API_BASE` if you ever need to point the frontend at a different proxy path.

Breed photography is loaded directly from `https://breedhealthscore.com/assets/img/breed/...`.
Images are plain `<img>` loads, so they are not affected by CORS. The list endpoint does not include
images, so cards derive the documented hero-image path from the breed slug; the detail endpoint's own
`image` object (with photographer credit) is used where available. A branded fallback is shown if a
photo is missing or fails to load.

### Caching and request hygiene

- The catalog is fetched **once** per session and cached in memory.
- Breed details are cached per slug and de-duplicated, so a breed is never fetched twice and
  re-opening a breed costs no request.
- The catalog renders from the single list request — Breedly **never** fetches every breed detail.
- Requests time out after 15 seconds and surface a typed `ApiError` (`network`, `timeout`, `http`,
  `parse`, `validation`).

---

## Project structure

```
src/
  components/   Reusable UI (layout, navbar, footer, cards, gauge, meters, states)
  context/      CompareProvider + compare context
  hooks/        useBreeds, useBreedDetail, useCompare, useDebouncedValue
  pages/        LandingPage, BreedExplorer, BreedDetails, CompareBreeds, About, NotFound
  services/     api.service.ts (all API calls, caching, error typing)
  types/        api.types.ts (raw wire shapes), breed.types.ts (normalized model)
  utils/        cn, format, grades, images, normalize, filterBreeds, ui
  index.css     Tailwind v4 theme + base styles
  router.tsx    Route definitions
  main.tsx      App entry point
```

### Routes

| Route | Page |
| ----- | ---- |
| `/` | Landing page (first screen) |
| `/breeds` | Breed explorer |
| `/breeds/:slug` | Breed details |
| `/compare` | Breed comparison |
| `/about` | About and data sources |
| `*` | Not found |

---

## Brand

| Token | Value | Usage |
| ----- | ----- | ----- |
| Primary blue | `#80A1C1` | secondary surfaces and actions |
| Soft cream | `#EEE3AB` | highlights and feature bands |
| Emerald green | `#07B07B` | primary buttons and positive indicators |

The colours are declared once in the Tailwind v4 `@theme` block in
[`src/index.css`](src/index.css) and consumed as `brand-blue`, `brand-cream` and `brand-emerald`
utilities.

---

## Attribution and licence

The dataset is licensed **CC BY 4.0** and attribution is required.

> Breed health data provided by [Breed Health Score](https://breedhealthscore.com). Licensed CC BY 4.0.

- Method: <https://breedhealthscore.com/methodology/>
- Median lifespan source: McMillan, K.M. et al. (2024), "Longevity of companion dog breeds",
  *Scientific Reports* (584,734 UK dogs) — <https://www.nature.com/articles/s41598-023-50458-w>

Lifespan estimates and breed-level health scores are based on **population data**, not individual
veterinary assessments. They do not predict the health of an individual dog. Always consult a
qualified veterinarian about a specific dog.

---

## Deploying to Vercel

The project is a standard Vite app and needs no environment variables.

1. Push the project to a GitHub (or GitLab/Bitbucket) repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Vercel auto-detects **Vite**. If it does not, select **Vite** as the framework preset.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Install command: leave at the npm default (`npm install`).
7. Deploy, then test the production URL:
   - `/` loads the landing page
   - "Get Started" opens `/breeds`
   - search, filters, sorting, "Load more" and breed details work
   - a direct visit to (and refresh of) `/breeds/beagle` and `/compare` works
   - the footer attribution and methodology links open breedhealthscore.com

`vercel.json` is what makes the two production behaviours work:

- `/api/bhs/*` is rewritten to the upstream API (to sidestep the missing CORS headers).
- Application routes fall back to `/index.html` (so deep links return 200, not 404), while
  `/api/*` and static `/assets/*` requests are deliberately left alone.

No secrets, no backend and no serverless functions are involved.

---

## Troubleshooting

- **The explorer shows "We couldn't load breed data"** — the upstream API or its network is
  unreachable. Use the **Retry** button. If you see a CORS error in the console, the request is not
  going through the proxy: check `vite.config.ts` (dev) or `vercel.json` (production).
- **Deep links 404 in production** — confirm `vercel.json` is present in the project root and that
  the SPA fallback rewrite was not removed.
- **A breed photo is missing** — Breedly falls back to a branded placeholder automatically.
