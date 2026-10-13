---
doc: spec
status: approved
---

# Where Am I? — Technical Spec

## How This Works, In Plain Language

"Where Am I?" is a single-page **React** web app that runs in the browser. The screen is filled by a photorealistic 3D view of a real place, served by **Google's Photorealistic 3D Tiles** (the same imagery that powers Google Earth). In the corner floats a small **Leaflet** map — a lightweight world map using free OpenStreetMap tiles — where you drop your guess.

The game knows a short, hand-picked list of real locations, written directly into the code. Each entry says where to point the 3D camera (so you drop into the right spot) and the true latitude/longitude of that place (so the game can score you). When you click the corner map, the app measures the straight-line distance between your pin and the real spot, shows that number in a bold scoreboard, and reveals the true location on the map. After about 5 seconds it moves to the next place, looping back to the first after the last one.

Nothing is saved between sessions — refresh and you start over. There's no database, no login, and no server of our own: just a React app, one Google API for the 3D world, and free map tiles for the guess map. This shape keeps the build small while protecting the one thing that makes the game work — a real, recognizable place you can fly through.

## The Core Journey Through the System
Implements `prd.md > The Core Journey`.

1. **Load / arrival** — the app reads the first entry in the in-code `locations` list → positions the Google 3D camera at that entry's start view → renders the Leaflet guess-map in the corner with no pin. No label shown. (`prd.md > The Core Journey` steps 1–2.)
2. **Explore** — the player flies/looks around; the Google 3D Tiles layer handles all camera movement. (`prd.md > Features and Behavior > Fly and explore the 3D scene`.)
3. **Guess** — the player clicks the Leaflet map → a marker is placed at the clicked lat/lng and the guess locks instantly (no confirm, no re-click that round). (`prd.md > Features and Behavior > Drop a pin to guess`.)
4. **Score + reveal** — the app computes great-circle distance (Haversine) between the pin and the entry's true lat/lng → shows the distance in the scoreboard overlay → drops a second marker on the Leaflet map at the true location. The 3D view stays interactive. (`prd.md > Features and Behavior > See how close you were`.)
5. **Linger + advance** — after ~5 seconds, the app advances to the next index in the list, wrapping back to 0 after the last entry, and resets the guess state. (`prd.md > Features and Behavior > Auto-advance to the next place`.)

```
┌───────────────────────────────────────────────┐
│  Google Photorealistic 3D Tiles (fills screen) │
│                                                 │
│                               ┌───────────────┐ │
│   [ scoreboard overlay ]      │ Leaflet guess │ │
│                               │ map (corner)  │ │
└───────────────────────────────┴───────────────┘ │
        │ click                         ▲
        ▼                               │ markers
   Haversine distance ─────────────────┘
```

## Stack

- **React 18** + **Vite** — the app shell and dev server. Vite is the lightest way to run a React app locally and record the demo. Chosen for fit with the learner's React/JS background. Docs: https://react.dev/ , https://vitejs.dev/
- **Google Maps Platform — Photorealistic 3D Tiles**, rendered via the Maps JavaScript API `Map3DElement` (experimental/`alpha` channel). Source of the flyable real-world 3D. Requires a GCP Maps API key with the Map Tiles API / 3D Tiles enabled. This is the kernel and the one hard external dependency. Docs: https://developers.google.com/maps/documentation/javascript/3d-maps-overview
- **Leaflet 1.9.x** + **react-leaflet 4.x** — the lightweight corner guess-map. Click-to-place-marker is trivial and OpenStreetMap tiles need no key. Chosen by the learner over MapLibre for lightness. Docs: https://leafletjs.com/ , https://react-leaflet.js.org/
- **OpenStreetMap raster tiles** — free base tiles for the Leaflet map (respect OSM tile usage policy; fine for a demo). Docs: https://wiki.openstreetmap.org/wiki/Raster_tile_providers
- **Vitest** + **@testing-library/react** — unit and integration tests. Vitest is the native test runner for Vite projects. Docs: https://vitest.dev/ , https://testing-library.com/docs/react-testing-library/intro/

> **To verify early in the build:** the exact current API for Google `Map3DElement` and its camera/`flyCameraTo` options, and which Maps JS API channel (`alpha`/`beta`) exposes it. This is experimental and its surface changes; confirm against the live docs before wiring the 3D camera, rather than trusting a remembered signature.

## Where It Runs and How Someone Tries It
Implements the submission needs for `6-ship`.

- **Runtime:** browser, served by the Vite dev server locally.
- **Environment:** Node.js 18+; a Google Maps Platform API key in a local `.env` file (`VITE_GOOGLE_MAPS_API_KEY`). No key needed for the Leaflet/OSM map.
- **Start:** `npm install` then `npm run dev`, open the printed `http://localhost:5173`.
- **Demo:** record the browser locally — drop into a place, fly, drop a pin, show the distance + true-location reveal, let it auto-advance. Submission requires a short demo video **and** a public GitHub repo.
- **Deployment:** optional, deferred to `6-ship`. Keeping it local for now; the video is sufficient for submission. (If later deployed, note the API key must be domain-restricted.)

### Submission links
- **Public GitHub repository:** https://github.com/Sk031397/WhereAmI
- **Demo video:** https://vimeo.com/1235577239

## Look and Feel
Carried from `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`. Direction, not a full design system.

- **Energy:** game-like personality — a bold scoreboard and a punchy result reveal — inside a cinematic, immersive-luxury frame. The 3D world is the star; UI never competes with it.
- **Panels:** floating, with deep soft drop shadows that separate them from the 3D canvas. Generous internal whitespace.
- **Typography:** elegant, wide letter-spacing, editorial character (e.g., a refined serif or a wide-tracked sans for the scoreboard numbers).
- **Palette:** warm dark tones — charcoal / deep espresso — paired with soft off-whites.
- **Avoid:** generic AI-app default styling; cramped or busy overlays.
- **Stack note:** all of this is plain CSS over React components; the stack imposes no limits on honoring it. The Leaflet panel is styled with a rounded container + shadow to match the floating-panel language.

## Components

### `App`
Top-level state and round orchestration: current location index, guess state (`exploring` → `locked`/`revealed`), the ~5s linger timer, and advance-with-wraparound. Holds the `locations` list.
PRD ref: `prd.md > The Core Journey`, `prd.md > Features and Behavior > Auto-advance to the next place`.

### `World3D`
Wraps the Google `Map3DElement`. Receives the current location's camera start view and positions the 3D camera. Stays interactive throughout, including during the reveal.
PRD ref: `prd.md > Features and Behavior > Fly and explore the 3D scene`.

### `GuessMap`
Leaflet map in the corner. Handles the map click → places the guess marker and reports the clicked lat/lng up to `App`; after lock, renders the true-location marker. Disables further clicks once locked.
PRD ref: `prd.md > Features and Behavior > Drop a pin to guess`.

### `Scoreboard`
The bold overlay. Shows round framing while exploring and the distance number on reveal, in the cinematic-luxury style.
PRD ref: `prd.md > Features and Behavior > See how close you were`.

### `lib/distance.js`
Pure Haversine great-circle distance between two lat/lng points, returned in km. The unit-tested core of scoring.
PRD ref: `prd.md > Features and Behavior > See how close you were`.

### `data/locations.js`
The hand-picked list (see Data Model).

## Data Model

A static, in-code array — no database, no fetch, no persistence (by learner decision; consistent with `prd.md > States and Boundaries > No persistence`).

```js
// data/locations.js
export const locations = [
  {
    name: "Eiffel Tower, Paris",     // internal label, NOT shown to player
    camera: {                        // where the 3D view starts
      center: { lat: 48.8584, lng: 2.2945, altitude: 300 },
      heading: 25, tilt: 65, range: 1200
    },
    answer: { lat: 48.8584, lng: 2.2945 }  // true location for scoring
  },
  // ... a small hand-picked set (enough for a round or two)
];
```

- **Where it lives:** in the bundled source. Loaded once at startup.
- **How it updates:** it doesn't — it's read-only reference data.
- **Leaving and coming back:** no persistence; a refresh restarts from index 0.
- **Runtime state** (not stored): `currentIndex`, `guessLatLng`, `phase` (`exploring`/`revealed`), `distanceKm` — all in React state, gone on refresh.

> The `camera` values are illustrative and must be hand-tuned per location during the build so each drops the player into a recognizable, well-framed view. Labelled as placeholder sample data until tuned.

## File Structure

```
basic_ai/
├── index.html
├── package.json
├── vite.config.js
├── .env                      # VITE_GOOGLE_MAPS_API_KEY (gitignored)
├── .env.example              # documents the key name, no secret
├── src/
│   ├── main.jsx              # React entry
│   ├── App.jsx               # round orchestration + state
│   ├── components/
│   │   ├── World3D.jsx       # Google Photorealistic 3D Tiles view
│   │   ├── GuessMap.jsx      # Leaflet corner map + pin logic
│   │   └── Scoreboard.jsx    # cinematic scoreboard overlay
│   ├── lib/
│   │   └── distance.js       # Haversine (pure, unit-tested)
│   ├── data/
│   │   └── locations.js      # hand-picked static location list
│   └── styles/
│       └── app.css           # cinematic-luxury styling
├── tests/
│   ├── distance.test.js      # unit: distance calc
│   └── round-flow.test.jsx   # integration: guess → reveal → advance/loop
└── devpost/                  # Devpost learning workspace
```

## External Services and Dependencies

- **Google Maps Platform — Map Tiles API / Photorealistic 3D Tiles** (via Maps JS API `Map3DElement`).
  - Auth: API key, loaded client-side via the Maps JS bootstrap loader with the appropriate (`alpha`/`beta`) version channel.
  - Key: `VITE_GOOGLE_MAPS_API_KEY` from `.env`; restrict by HTTP referrer for any deploy.
  - Cost/limits: Google Maps Platform has a monthly free credit; 3D Tiles usage counts against it. For a hand-picked demo set the usage is tiny, but confirm current pricing/quota in the console.
  - Docs: https://developers.google.com/maps/documentation/javascript/3d-maps-overview
- **OpenStreetMap tile server** (Leaflet base layer).
  - Auth: none. Follow the OSM tile usage policy (set a proper attribution; fine for low-volume demo use).
  - Docs: https://operations.osmfoundation.org/policies/tiles/

## Important Failure Modes

- **Google 3D Tiles fail to load** (bad/absent key, quota, network) → the screen can't show the kernel. Fallback: a plain in-app message ("Couldn't load the 3D world — check the API key") instead of a blank/broken canvas, so the failure is legible during the demo.
- **Player clicks the 3D view expecting to guess** → clicks there do nothing for scoring; only the Leaflet map registers a guess. Mitigation: the corner map is always visible and visually invites the click; keep its affordance clear.
- **OSM tiles slow/unavailable** → the guess-map base imagery is blank but the click/markers still work (distance still computes). Acceptable degraded state for the demo.

## What Was Simplified and Why

- **Static in-code location list** instead of a database or an external "random place" service — a small hand-picked set fully proves the recognition kernel with zero infrastructure and total control over which recognizable places appear. The fuller version (large/randomized pool) is deferred per `prd.md > Deferred From the POC`.
- **No persistence / no accounts** — refresh restarts the game. Nothing about scoring a single guess needs saved state. (`prd.md > States and Boundaries`.)
- **Loop back to the first location** after the last, instead of an end-of-game tally screen — keeps continuous play with no extra UI; aggregate scoring is deferred per `prd.md > Deferred From the POC`.
- **Leaflet + OSM** instead of a heavier mapping SDK — the guess-map only needs click-to-place and a reveal marker, so the lightest option with no API key is the right size.

## Decisions and Open Issues

- **React + Vite web app** — learner's stack; natural fit for 3D tiles + a browser map. Tradeoff: client-side only, so the API key is exposed in the browser (standard for Maps JS; mitigated by referrer restriction).
- **Google Photorealistic 3D Tiles for the world** — the only realistic way to get flyable, recognizable real places; it *is* the kernel. Tradeoff accepted: one hard external dependency and a required GCP key.
- **Leaflet (over MapLibre) for the guess-map** — learner's choice for lightness; OSM tiles mean no second key.
- **Static in-code location list; loop back after the last** — learner's choice. Resolves `prd.md > Open Questions` (end-of-set behavior = loop).
- **Local-only run for now** — deployment deferred to `6-ship`; local recording satisfies submission.
- **Testing approach** (ties to `learner-profile.md > Desired Learning Outcome`): unit tests for `lib/distance.js` (known city pairs → expected km) and round-advance/loop logic; integration test for the guess → reveal → advance flow with the Leaflet map (React Testing Library); manual smoke test for the Google 3D view in the demo recording, since the external tiles layer can't be meaningfully unit-tested.

**One genuine uncertainty (the learner's least-sure spot):** testing the 3D tiles layer. Resolved by design — the pure/stateful logic is covered by automated unit + integration tests, and the inherently-visual 3D layer is covered by a documented manual smoke test rather than pretending to unit-test an external rendering surface. To verify during the build: the live `Map3DElement` camera API (noted under Stack) before wiring `World3D`.

**Open issues:** none blocking. The only build-time verification is confirming the current Google 3D Maps API surface before implementing `World3D`.
