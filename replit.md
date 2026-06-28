# Mystique Compass

A cosmic numerology and astrology profile generator. Users enter a name or search Wikipedia for a celebrity/historical figure and get a full numerological reading including life path, psychomatrix, Lo Shu grid, Chinese zodiac, personal year charts, and more.

## Run & Operate

- `pnpm --filter @workspace/mystique run dev` — run the frontend (Vite, port 24479)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS 4 (cosmic dark theme)
- API: Express 5
- Validation: Zod
- Charts: Chart.js + react-chartjs-2, Recharts
- PDF export: jsPDF
- 3D: Three.js

## Where things live

- `artifacts/mystique/src/` — React frontend (components, pages, numerology logic)
- `artifacts/mystique/src/lib/numerology/` — all numerology calculation engines
- `artifacts/mystique/src/lib/zodiac/` — Chinese zodiac data
- `artifacts/api-server/src/routes/biography.ts` — Wikipedia biography lookup (returns birth data + `wikipediaUrl`)
- `artifacts/api-server/src/routes/index.ts` — API router mounting

## Architecture decisions

- All numerology calculations run client-side (no DB needed)
- Wikipedia is fetched server-side through the `/api/biography` endpoint to avoid CORS issues
- Biography response includes `wikipediaUrl` field pointing to the full Wikipedia article
- PWA-ready: includes service worker, manifest, and install prompt

## Product

- Search any name or Wikipedia article to auto-fill birth data
- Full numerological profile: life path, destiny, soul urge, psychomatrix, Lo Shu grid
- Chinese zodiac analysis per animal sign
- Personal year charts and temporal predictions
- PDF export of the full reading

## Gotchas

- `artifacts/mystique` requires `PORT` and `BASE_PATH` env vars at build time (provided by Replit workflows automatically)
- The biography route fetches from Wikipedia's public API; titles with special characters are URL-encoded

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
