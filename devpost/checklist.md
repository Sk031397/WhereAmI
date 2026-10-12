---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. The app runs and drops you into a real 3D place you can fly around**
  Becomes usable: `npm run dev` opens a React app whose screen is filled by Google's Photorealistic 3D Tiles, dropped into the first hand-picked location, and you can look/fly around it. This is the kernel, built first.
  Why now: The flyable real-world 3D *is* the game (`scope.md > The Unique Kernel`) and it's the riskiest piece — an experimental Google API. Proving it loads and flies on slice one means every later slice lands on solid ground, and if the API surface differs from the spec we find out immediately.
  PRD ref: `prd.md > The Core Journey` (steps 1-2), `prd.md > Features and Behavior > Fly and explore the 3D scene`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Components > World3D`, `spec.md > Data Model`, `spec.md > External Services and Dependencies`
  Build: Scaffold React + Vite per the spec file structure, install deps, add `.env.example` + `.env` for `VITE_GOOGLE_MAPS_API_KEY`, create `data/locations.js` with the hand-picked list (camera start + answer coords), and build `World3D` to load the Maps JS `Map3DElement` and position the camera at the first location. Apply `spec.md > Look and Feel` (full-screen 3D canvas) from the start.
  Verify (mechanical): Confirm the latest `Map3DElement`/camera API against the live Google docs before wiring (spec flagged it experimental). Run `npm run dev`, confirm it starts with no console errors, and confirm the 3D tiles render a recognizable place that responds to drag/zoom. If the key/tiles fail, confirm the legible fallback message shows instead of a blank canvas.
  Learner check: Open the app, fly around the first place, and say whether that "dropped into a real place" feeling lands the way you pictured.
  Commit: `Scaffold app and render flyable Photorealistic 3D Tiles`

- [x] **2. A corner map is always on screen and you can drop a pin on it**
  Becomes usable: A small Leaflet map floats in the corner over the 3D view; clicking it drops a single marker and locks it (one guess, no re-click).
  Why now: The guess surface is the second half of the core loop. Adding it now — before scoring — lets us confirm the always-visible corner panel and the instant-lock interaction feel right before wiring numbers to it.
  PRD ref: `prd.md > The Core Journey` (step 3), `prd.md > Features and Behavior > Drop a pin to guess`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Components > GuessMap`, `spec.md > Stack` (Leaflet/react-leaflet/OSM), `spec.md > Look and Feel`
  Build: Add Leaflet + react-leaflet + OSM tile layer. Build `GuessMap` as a floating corner panel (shadowed, rounded, per Look and Feel). Handle map click → place one marker, report lat/lng up to `App`, and disable further clicks once locked. Hold `guessLatLng` and `phase` in `App` state.
  Verify (mechanical): Run the app; confirm the corner map renders with OSM tiles, a click places exactly one marker, and a second click does nothing (lock holds). Confirm no console errors.
  Learner check: Click the corner map to drop your pin, try clicking again, and confirm it locks on the first drop the way you wanted.
  Commit: `Add always-on Leaflet guess map with instant pin lock`

- [x] **3. You get a distance score and the true location is revealed**
  Becomes usable: After you lock a pin, a bold scoreboard shows how far off you were (km) and the true location appears on the corner map next to your pin.
  Why now: This closes the recognition payoff — the "how close was I" moment (`scope.md > What "Working" Looks Like`). It depends on the pin (slice 2) and the location data (slice 1) already existing.
  PRD ref: `prd.md > The Core Journey` (step 4), `prd.md > Features and Behavior > See how close you were`
  Spec ref: `spec.md > Components > Scoreboard`, `spec.md > Components > lib/distance.js`, `spec.md > Data Model`, `spec.md > Look and Feel`
  Build: Add `lib/distance.js` (pure Haversine → km). On pin lock, compute distance between the guess and the current location's `answer`, set `distanceKm` and `phase=revealed`. Build `Scoreboard` as the cinematic-luxury overlay showing the distance. Drop a second marker on `GuessMap` at the true location.
  Verify (mechanical): Add and run a Vitest unit test for `distance.js` against known city pairs (expected km within tolerance). Run the app; confirm locking a pin shows a sensible distance number and the true-location marker appears. `npm.cmd test` passes.
  Learner check: Drop a pin somewhere you know is wrong, and confirm the distance number and the revealed true location make sense and feel punchy.
  Commit: `Add Haversine scoring and true-location reveal`

- [x] **4. It lingers on the result, then auto-advances and loops**
  Becomes usable: After the reveal, the result holds ~5 seconds (3D still flyable), then the game advances to the next location on its own, looping back to the first after the last.
  Why now: This turns three static behaviors into the continuous "one more place" loop (`prd.md > The Core Journey` step 5). It's last because it orchestrates the slices beneath it and needs them all working.
  PRD ref: `prd.md > The Core Journey` (step 5), `prd.md > Features and Behavior > Auto-advance to the next place`
  Spec ref: `spec.md > Components > App`, `spec.md > The Core Journey Through the System`
  Build: In `App`, after reveal start a ~5s timer, keep the 3D view interactive during it, then advance `currentIndex` (wrapping to 0 after the last entry) and reset `guessLatLng`/`phase` so the next place starts clean. Repoint `World3D` camera to the new location.
  Verify (mechanical): Add a Vitest unit test for the advance-with-wraparound logic (last index → 0) and reset of guess state. Run the app; confirm after a guess it waits ~5s, the 3D stays draggable during the wait, then the next place loads, and that it loops after the final location. `npm.cmd test` passes.
  Learner check: Make a guess, confirm you can still fly during the ~5s reveal, watch it move to the next place, and play through to confirm it loops back around.
  Commit: `Add result linger, auto-advance, and loop`

- [x] **5. Scoring, running total, and a fixed 5-round game with a final tally**
  Becomes usable: Each guess earns points (closer = more), a running total shows on the scoreboard with a "Round N of 5" indicator, and after round 5 a final tally screen shows the total with a play-again button that resets to round 1.
  Why now: Scope change — the player pulled running score + fixed rounds + tally from `scope.md > Later` into the POC to make the working loop feel like a game. Builds directly on the slice 1-4 loop.
  PRD ref: `prd.md > Features and Behavior > See how close you were`, `prd.md > Features and Behavior > Play five rounds, then see a final tally`, `prd.md > The Core Journey` (steps 5-6)
  Spec ref: `spec.md > Components > App`, `spec.md > Components > Scoreboard`, `spec.md > Components > lib/distance.js`
  Build: Add a pure `scoreFromDistanceKm` in `lib/gameState.js` (max points for near-zero, decaying with distance). Extend state with `totalScore`, `round`, and a `finished` phase; `placeGuess` adds round points to the total; `advance` increments the round and switches to `finished` after round 5 instead of wrapping. Update `Scoreboard` to show points earned + running total + "Round N of 5". Add a `FinalTally` component (total score + play-again). Wire `App` to render the tally when finished and reset on play-again.
  Verify (mechanical): Extend `gameState` unit tests — points decay with distance, running total accumulates across rounds, `finished` triggers after round 5 (not a wraparound), play-again resets total/round. `npm.cmd test` passes; `npm.cmd run build` compiles.
  Learner check: Play all 5 rounds; confirm points feel right (near guesses score high), the running total climbs, the round indicator counts up, and the tally + play-again work.
  Commit: `Add scoring, running total, and 5-round game with final tally`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1. Learner has no Google Maps API key yet, so live 3D-tile rendering is deferred to the final review; build verified via compile + clean dev-server boot, and the no-key fallback card confirmed. No look/camera change requested.
- [x] Final kick-the-tires exploration and feedback completed — app runs via `npm.cmd run dev`; live 3D is key-gated (learner has no Google key yet) so it shows the fallback card, and automated verification covers the rest (12/12 tests, clean boot). Learner reviewed free-map alternatives and decided to keep Google Photorealistic 3D Tiles (the only source that preserves the recognition kernel). No functional changes requested.

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Focused alternative (experienced plan-first learner). Connected the testing goal to a real build decision — extracting all game logic into the pure `src/lib/gameState.js` reducer because the Google 3D tiles layer can't be unit-tested. Evidence cited: `tests/gameState.test.js` "wraps back to the first location after the last" (the PRD loop decision as an executable assertion), 12/12 tests passing.
Route and stops: Reference route in app-map.html — gameState.js (placeGuess/advance), distance.js (haversineKm), App.jsx (REVEAL_LINGER_MS + timer), components/, data/locations.js. Symbols/paths verified against source via grep.
Edit outcome: not applicable — focused alternative, no code edit; learner declined no specific edit (none offered as the connection was to existing test evidence).
Reflection: pending — optional transfer question offered at hand-off.
Activity mode: focused alternative (evidence-based), app map generated from commit 235287e.

## Revisions

- Set a required `mode` on `Map3DElement` (`Map3DMode.SATELLITE`) in `src/components/World3D.jsx` — the build discovered the live Google 3D Maps API (v3.60.1+, post Feb 2025) rejects a 3D map with no `mode`, producing "Attempted to load a 3D Map, but failed." SATELLITE gives label-free photorealistic imagery, which also fits the game (labels would reveal the location). Also added optional Map ID support and scoped Vitest to `tests/` so a stray `.trunk` plugin cache stopped polluting the test run. Internal corrections; the kernel and all learner product decisions are unchanged.

- Extracted game-state transitions into a pure `src/lib/gameState.js` reducer (and created `src/lib/distance.js` during slice 2 instead of slice 3) — the build showed the lock/score/advance logic is far more reliably verifiable as pure functions than through simulated Leaflet DOM clicks in jsdom. Internal design choice; preserves all learner product decisions. `distance.js` is still exercised by its own unit test in slice 3 as planned.
