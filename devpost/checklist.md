---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. You stand outside a stylized Stamford Bridge and walk around it (first-person)**
  Becomes usable: A running app that opens on a lit, blue stylized Stamford Bridge exterior; you click to capture the mouse, move with WASD, pan with the mouse, and a contextual tutorial reveals controls as you first use them.
  Why now: Bootstrapping has to live somewhere, and this one slice proves the whole rendering/controls spine (Vite + Three.js, render loop, PointerLock look, movement, tutorial) with something you can actually walk around in.
  PRD ref: `prd.md > The Core Journey` (steps 1-3), `prd.md > Exploring a stadium (outside and in)`
  Spec ref: `spec.md > Components` (World/Renderer, First-person Controls + Tutorial, Scenes), `spec.md > File Structure`, `spec.md > Look and Feel`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Scaffold per spec file structure (`index.html`, `package.json`, `vite.config.js`, `src/`). Install `three` and `vite` (confirm current `three` version and whether `PointerLockControls` is in `three/addons/` against the docs on first install). Build `core/renderer.js` (WebGLRenderer + render loop), `core/sceneManager.js` (load/place active scene), `scenes/stamfordBridge.js` (low-poly blue exterior + interior bowl + walk-in entrance + spawn), `controls/firstPerson.js` (WASD + PointerLock look), `controls/tutorial.js` (progressive hints), and a "Click to look around" / WebGL-unsupported fallback. Wire in `main.js`.
  Verify (mechanical): Run `npm run dev`, confirm it starts with no errors and the dev URL serves the page; open it, click the canvas, and confirm the camera moves with WASD and pans with the mouse, and the first tutorial hint appears.
  Learner check: Open the app, click to capture the mouse, walk up to and into the stadium, and say whether the look, feel, and controls match what you pictured.
  Commit: `Scaffold Matchday Hop: Stamford Bridge scene with first-person controls and tutorial`

- [ ] **2. Walk into zones and collect rivalry cards, reviewable in the log (J)**
  Becomes usable: Walking into 2-3 geofence zones (outside and inside Stamford Bridge) pops a non-blocking rivalry card that auto-dismisses after ~5-10s; each card saves to your log; pressing J opens the collected-cards log (with an empty state), and it persists across restarts.
  Why now: Completes the single-stadium loop and exercises the data model + localStorage persistence early, where mistakes are cheap to fix.
  PRD ref: `prd.md > Geofence info-zones and cards`, `prd.md > The collected-cards log (J)`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components` (Zone System, Card Overlay, Log Overlay, Log Store, Data), `spec.md > Data Model`, `spec.md > Important Failure Modes`
  Build: Add `data/stadiums.js` (Stamford Bridge zones: box center/size + card content with drafted rivalry facts). Build `zones/zoneSystem.js` (per-frame AABB camera-vs-box enter checks, supports re-entry), `ui/card.js` (non-blocking slide-in overlay, auto-dismiss ~5-10s, writes to log), `state/logStore.js` (localStorage wrapper: getCollected/addCard, de-dupe, in-memory fallback on corrupt/unavailable), `ui/log.js` (J toggle, lists collected cards, "No cards collected yet" empty state). Wire zone checks into the render loop and the J keybind.
  Verify (mechanical): Run the dev server; walk into a zone and confirm the card appears without stopping movement and auto-dismisses; press J before and after collecting to confirm empty state then listed cards; add two cards, restart the server, reload, and confirm they persist via localStorage.
  Learner check: Collect a couple of cards, open the log with J, restart the app, and confirm your collected cards are still there.
  Commit: `Add geofence zones, rivalry cards, and persistent collected-cards log`

- [ ] **3. Open the map (M), pick Bus, and watch the cinematic journey — the kernel**
  Becomes usable: Pressing M opens the London atlas/compass map with a labeled pin per ground and "You are here"; clicking the destination pin reveals the Bus travel mode; selecting Bus plays a skippable ~30s cinematic camera flythrough over low-poly "London" with a matchday soundscape, then returns you to a stadium exterior.
  Why now: This is the whole point of the app. Proving the cinematic journey feels right early means everything else is just setting — and if the camera path or pacing is wrong, we find out now, not last.
  PRD ref: `prd.md > The map and travel selection (M)`, `prd.md > The journey simulation (the kernel)`, `scope.md > The Unique Kernel`
  Spec ref: `spec.md > Components` (Map Overlay, Journey Controller, Data), `spec.md > Data Model`, `spec.md > Important Failure Modes` (audio autoplay), `spec.md > Look and Feel`
  Build: Add `data/mapConfig.js` (two pins, labels, spline path points). Build `ui/map.js` (M toggle, atlas/compass styling, pins + "You are here", destination pin reveals Bus, current-stadium pin inactive with "you're already here" nudge). Build `journey/londonScene.js` (abstract low-poly city flythrough geometry) and `journey/journeyController.js` (hide overlays, animate camera along a `CatmullRomCurve3` spline ~30s, matchday soundscape triggered on the Bus-click user gesture so autoplay isn't blocked, Skip control, hand off to SceneManager on finish/skip). Source a royalty-free crowd/ambience clip into `public/audio/`. For this slice the handoff returns to Stamford Bridge (Emirates arrives in slice 4).
  Verify (mechanical): Run the dev server; press M and confirm both pins + "You are here"; click the current pin and confirm it does NOT launch a journey; click the destination pin, select Bus, and confirm the cinematic flythrough plays over the low-poly city with sound, that Skip ends it immediately, and that it finishes at a stadium exterior with control returned.
  Learner check: Open the map with M, pick Bus, and watch the journey — tell me whether the kernel ("the cool beat") feels the way you imagined, and what you'd change about the camera, pacing, or sound.
  Commit: `Add map overlay and cinematic Bus journey simulation (kernel)`

- [ ] **4. Arrive at a stylized Emirates and hop both directions**
  Becomes usable: The Bus journey now deposits you outside a lit, red stylized Emirates with its own interior, zones, and rivalry cards; you can explore it, open the map, and hop back to Stamford Bridge — the full Core Journey loop works both directions.
  Why now: It reuses everything proven in slices 1-3; the second ground is the payoff, not the risk, so it lands last.
  PRD ref: `prd.md > The Core Journey` (steps 8-9), `prd.md > What We're Building` (two grounds, hop both directions)
  Spec ref: `spec.md > Components` (Scenes, Scene Manager, Data), `spec.md > Look and Feel`, `spec.md > The Core Journey Through the System` (step 9)
  Build: Add `scenes/emirates.js` (red low-poly exterior + interior bowl + entrance + spawn) and its Emirates zones + distinct card content in `data/stadiums.js`. Wire `sceneManager.js` so the journey controller's handoff loads the destination scene and places the camera outside it; make the map's destination resolve relative to the current stadium so hops work both ways (Stamford Bridge <-> Emirates). Confirm per-ground color blocking on overlays.
  Verify (mechanical): Run the dev server; complete a Bus journey and confirm you arrive outside the red Emirates with its own zones/cards; collect an Emirates card and confirm it logs; open the map at the Emirates, confirm "You are here" moved, pick Bus, and confirm you arrive back at Stamford Bridge — the full loop runs end to end both directions.
  Learner check: Run the whole ~1-minute loop (Stamford Bridge -> cards -> map -> Bus -> journey -> Emirates -> back), and tell me how the complete experience feels.
  Commit: `Add Emirates scene and bidirectional stadium hopping`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after Slice 1 (look/feel + controls feedback shapes the rest of the build)
- [ ] Final kick-the-tires exploration and feedback completed — after Slice 4 (full Core Journey loop)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
