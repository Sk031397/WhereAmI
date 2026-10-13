# Where Am I?

A browser game: you're dropped into a real, photorealistic 3D location (Google
Photorealistic 3D Tiles), fly around to recognize where you are, then guess by
dropping a pin on a world map or typing the place name. Each guess is scored by
distance; you play five rounds against a simulated AI opponent, with optional
point-costing hints, and a final tally declares a winner.

> This README is factual setup/run documentation. It is not the project pitch.

## Tech stack

- **React 18** + **Vite 5** — single-page app, dev server, and build.
- **Google Maps JavaScript API — Photorealistic 3D Tiles** (`Map3DElement`,
  `maps3d` library) — the flyable 3D world. Requires a Google Maps Platform API key.
- **Leaflet 1.9** + **react-leaflet 4** + **OpenStreetMap** tiles — the corner
  guess map (no key required).
- **Vitest** + **@testing-library** — unit/logic tests.

## Prerequisites

- **Node.js 18+** and npm.
- A **Google Maps Platform API key** with the **Map Tiles API** enabled, and a
  billing account active on the Google Cloud project. (3D Maps requires this; the
  monthly free credit covers light/demo usage.) Without a key the app runs and
  shows a legible fallback message instead of the 3D world.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the project root (copy from `.env.example`):
   ```
   VITE_GOOGLE_MAPS_API_KEY=your-key-here
   # Optional, only if your API version requires a vector Map ID for 3D maps:
   VITE_GOOGLE_MAPS_MAP_ID=your-map-id-here
   ```
   Replace `your-key-here` with your real key. `.env` is gitignored and must not
   be committed.

## Run

```
npm run dev
```
Then open the printed URL (default http://localhost:5173).

## Build / preview

```
npm run build      # production build to dist/
npm run preview    # serve the production build locally
```

## Tests

```
npm test           # run the unit/logic suite once
npm run test:watch # watch mode
```
The tests cover the pure game logic (distance, scoring, round/advance/loop,
AI opponent, hints, name matching, map-race interpolation). The 3D-tiles layer
is verified manually in the browser (it depends on the live Google API).

## Project structure

```
src/
├── main.jsx              # React entry
├── App.jsx               # round orchestration + wiring
├── components/
│   ├── World3D.jsx       # Google Photorealistic 3D Tiles view
│   ├── GuessMap.jsx      # Leaflet corner map, pins, hint region, on-map race
│   ├── Scoreboard.jsx    # objective prompt + result reveal (You vs AI)
│   ├── FinalTally.jsx    # end-of-game winner screen
│   ├── HintPanel.jsx     # point-costing hints
│   ├── TypeGuess.jsx     # type-the-place-name input
│   ├── PlayerOrb.jsx     # glowing You/AI identity orbs
│   └── StartScreen.jsx   # intro / how-to-play
├── lib/
│   ├── gameState.js      # pure game logic (scoring, rounds, AI, hints, matching)
│   ├── distance.js       # Haversine distance + lat/lng interpolation
│   └── googleMaps.js     # Google Maps JS API loader
├── data/
│   └── locations.js      # hand-picked locations (camera, answer, hints)
└── styles/
    └── app.css           # cinematic-luxury styling

devpost/                  # planning docs (scope, prd, spec, checklist, app map)
tests/                    # Vitest unit/logic tests
```

## Notes

- No backend, no database, no accounts — everything runs client-side; nothing is
  persisted between sessions.
- The AI opponent is a scripted simulation (it guesses near the true location
  with randomized error), not a model that "sees" the 3D scene.
