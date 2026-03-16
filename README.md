# Real Scale Solar System

Interactive 3D solar system simulation with true-to-scale visualization, two simulation modes (speed/date), and scientific data fallback from local dataset + remote API proxy.

## Features

- True-to-scale solar system visualization in 3D
- Speed Mode and Date Mode (toggleable)
- Date transition animation with easing + cancel support
- Historical events panel with search/filter/date jump
- Orbit paths with orbital inclination support
- Asteroid belt regions (main + Kuiper) toggle
- Planet textures, atmospheric glow, rings
- API fallback model:
  - First try internal API route (`/api/planets/[name]`)
  - If API fails, use local static data
- Caching:
  - Client cache for merged API results (`localStorage`)
  - Astronomy calculation cache (hour-bucketed) for Date Mode performance
- Web Worker for rotation calculations with main-thread fallback

## Tech Stack

- React 19
- TypeScript 5
- Vinext + Vite 8
- `@react-three/fiber` + `three` + `@react-three/drei`
- Tailwind CSS 4
- `astronomy-engine`
- Vitest + Testing Library
- Wrangler (Cloudflare deployment workflow)

## Project Structure

- `app/` App entry + API route
- `components/` UI and 3D scene components
- `hooks/` simulation, transition, and worker hooks
- `utils/` astronomy/math/formatting/validation helpers
- `services/` API proxy client, merge/cache logic
- `features/` feature-first modules:
  - `date-mode`
  - `planet-data`
  - `simulation-control`
  - `planet-rendering`
  - `historical-events`
  - `planet-modal`
  - `rotation-worker`
  - `belt-regions`
- `workers/` Web Worker implementations
- `data/` local planet data + historical events
- `__tests__/` unit and integration tests

## Run Locally

### Prerequisites

- Node.js 18+
- pnpm 10+

### Install

```bash
pnpm install
```

### Optional API key

```bash
cp .env.local.example .env.local
```

Set `SOLAR_SYSTEM_API_KEY` in `.env.local` if you want authenticated upstream requests.  
Without it, the app still works via fallback local data.

### Start dev server

```bash
pnpm dev
```

## Scripts

- `pnpm dev` - run dev server
- `pnpm build` - production build
- `pnpm start` - start production server
- `pnpm deploy` - deploy flow via Vinext
- `pnpm lint` - ESLint
- `pnpm test` - Vitest run once
- `pnpm test:watch` - Vitest watch
- `pnpm test:ui` - Vitest UI

## API Behavior

Internal route: `GET /api/planets/[name]`

- Runtime: Edge
- Upstream: `https://api.le-systeme-solaire.net/rest/bodies/{planet}`
- Timeout: 10 seconds
- Accepted planets: `mercury`, `venus`, `earth`, `mars`, `jupiter`, `saturn`, `uranus`, `neptune`
- Invalid planet names return HTTP `400`

## Notes and Limits

- Date input is parsed in local time to avoid UTC off-by-one day issues.
- Astronomy cache is bucketed by hour for better accuracy/performance balance in Date Mode.
- TypeScript build errors are not ignored during build, so type regressions fail fast in CI/deploy.

## Testing and Quality

Run full checks:

```bash
pnpm lint && pnpm test
```

Security audit:

```bash
pnpm audit --prod
```

## License

MIT. See [LICENSE](LICENSE).
