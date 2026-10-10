---
doc: spec
status: approved
---

# Matchday Hop — Technical Spec

## How This Works, In Plain Language

Matchday Hop is a single web page that runs a 3D world in your browser using **Three.js** (a JavaScript 3D library) with **WebXR** so it's headset-ready, but driven by mouse and keyboard on desktop for this POC. There's no server and no database — everything runs in the browser, and the one thing that needs to be remembered between visits (your collected-cards log) is written to **localStorage**, the browser's per-site sticky note.

The world is one continuous first-person scene. You start outside a stylized Stamford Bridge, walk up and in, and roam. Invisible **trigger zones** (we check, every frame, whether your camera has walked into a box in space) pop up info cards about the rivalry. Pressing **J** opens your log of collected cards; pressing **M** opens a map overlay. On the map you pick the rival ground and a travel mode (Bus), and a scripted **cinematic camera flythrough** plays — the camera flies along a pre-planned path across a low-poly stylized "London" with matchday crowd sound — then deposits you outside the Emirates, where the whole loop repeats in red.

The overlays (cards, log, map) are plain HTML/CSS layered on top of the 3D canvas, not drawn inside the 3D scene. That's deliberate: HTML text is sharper, easier to style, and far cheaper to build than in-world 3D panels, and for a desktop POC it reads perfectly.

Why this shape: no backend means nothing to deploy or secure, the whole thing is a static site you can record locally and push to GitHub, and the only moving parts are the ones that actually prove the idea — the journey and the geofence cards.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. **Load** → Vite serves `index.html`; `main.js` boots the Three.js renderer, loads the Stamford Bridge scene, and places the first-person camera outside it. (`prd.md > The Core Journey` step 1)
2. **Tutorial** → a small controls module watches your first movement/pan/interact and reveals the matching hint as HTML, non-blocking. (`prd.md > Exploring a stadium`)
3. **Move** → keyboard (WASD/arrows) drives position, mouse drives camera pan, each frame in the render loop. (`prd.md > Exploring a stadium`)
4. **Enter a zone** → every frame, the zone system checks the camera position against each zone's bounding box; on entry it fires an event. (`prd.md > Geofence info-zones and cards`)
5. **Card appears** → the card overlay slides in with that zone's content, writes the card ID to the log store (localStorage), and auto-dismisses after ~5–10s. Movement never stops. (`prd.md > Geofence info-zones and cards`)
6. **J → log** → reads the log store and renders the collected cards (or the empty state). (`prd.md > The collected-cards log`)
7. **M → map** → the map overlay shows both grounds, "You are here," and travel-mode choices. (`prd.md > The map and travel selection`)
8. **Pick Bus** → the journey controller takes over: hides overlays, plays the scripted camera animation along the spline over low-poly London, plays the soundscape, offers Skip. (`prd.md > The journey simulation`)
9. **Arrive** → the controller swaps the active scene to the Emirates and places the camera outside it — back to step 2, in red. (`prd.md > The journey simulation`, `prd.md > The Core Journey` step 9)

## Stack

- **Language:** JavaScript (ES modules), HTML, CSS.
- **3D / XR:** [Three.js](https://threejs.org/docs/) (`three`, latest stable) — WebGL renderer, scene graph, `WebXR` support, `PointerLockControls` for first-person look, and the `AnimationMixer` / `CatmullRomCurve3` tools for the scripted journey camera. Chosen because the learner has shipped VR and wants direct control over the cinematic journey camera and the stylized look rather than a framework's abstraction. Tradeoff accepted: more plumbing (render loop, controls, zone checks) written by hand.
- **Build / dev server:** [Vite](https://vitejs.dev/guide/) — `npm run dev` for hot-reload iteration, `npm run build` for a static bundle. Chosen for fast iteration while tuning the cinematic camera and a clean static output for the public repo. Tradeoff: one Node install up front.
- **Persistence:** browser [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) — holds collected-card IDs as JSON. Chosen because the cross-session log needs no infrastructure. (Learner chose to keep cross-session persistence.)
- **Audio:** HTML5 `Audio` / Web Audio for the matchday soundscape loop during the journey.
- **Unverified / check early in build:** exact current `three` version and whether `PointerLockControls` is imported from `three/addons/`. Flag to confirm against the docs on first `npm install`.

## Where It Runs and How Someone Tries It

- **Runtime:** desktop browser (Chrome/Edge recommended for WebXR), mouse + keyboard. No API keys, no accounts.
- **Environment:** Node.js (for Vite dev/build) — install once.
- **Start it:**
  ```
  npm install
  npm run dev      # opens a local dev URL, e.g. http://localhost:5173
  ```
  Open the printed URL, click the canvas to capture the mouse, and move with WASD.
- **Build a static bundle:** `npm run build` → `dist/` (what gets pushed / optionally hosted).
- **Demo:** submission requires a short demo video **and** a public GitHub repository. Running locally and recording the ~1-minute loop (Stamford Bridge → cards → map → Bus → journey → Emirates) is sufficient. **Deployment is optional** and not planned for the POC; revisit in `6-ship` if a shareable link is wanted (Vite's `dist/` drops onto any static host).

## Look and Feel

Carried forward from `prd.md > Look and Feel` and `scope.md > Inspiration & Identity` — do not re-interview.

- **Mood:** vibrant, saturated, playful, arcade-leaning; explicitly not photoreal.
- **Palette:** Stamford Bridge evoked with a Chelsea-ish **blue**, Emirates with an Arsenal-ish **red** — colors that *suggest* each club **without exact brand colors**. Generic/original stand and crest shapes, no real logos or replica geometry.
- **Geometry:** low-poly stylized stadiums (recognizable as "a stadium," not a replica) and abstract low-poly "London" for the journey.
- **Interface copy:** short, game-like, energetic. Overlays are clean HTML cards with strong color blocking per ground.
- **Stack honor:** Three.js handles all of this directly; HTML/CSS overlays keep text crisp and on-brand per ground.

## Components

### World / Renderer (`src/core/`)
Boots the Three.js `WebGLRenderer`, scene, camera, lights, render loop, and WebXR session. Owns the per-frame `update()` that drives controls, zone checks, and the journey animation.
PRD ref: `prd.md > Screens and Surfaces` (the stadium world).

### Scenes (`src/scenes/`)
Two stylized stadium scenes (Stamford Bridge, Emirates), each: exterior shell, interior bowl, entrance you can walk through, spawn point, and its zone + card data. A `SceneManager` loads/swaps the active scene and places the camera outside on arrival.
PRD ref: `prd.md > Exploring a stadium (outside and in)`, `prd.md > The Core Journey`.

### First-person Controls + Tutorial (`src/controls/`)
Keyboard movement, mouse-look (`PointerLockControls`), and a contextual tutorial that reveals movement → pan → interact hints as the player first does each, without blocking movement.
PRD ref: `prd.md > Exploring a stadium (outside and in)`.

### Zone System (`src/zones/`)
Axis-aligned bounding boxes placed outside and inside each stadium (2–3 per ground). Each frame, checks whether the camera entered a zone and emits an enter event; supports re-entry.
PRD ref: `prd.md > Geofence info-zones and cards`.

### Card Overlay (`src/ui/card`)
Non-blocking HTML panel that slides in on zone entry, shows that zone's rivalry fact, writes the card to the log store, and auto-dismisses after ~5–10s. Different content per ground.
PRD ref: `prd.md > Geofence info-zones and cards`, `prd.md > States and Boundaries` (Card showing).

### Log Overlay (`src/ui/log`)
Toggled by **J**. Reads the log store and lists collected cards; shows "No cards collected yet" when empty.
PRD ref: `prd.md > The collected-cards log (J)`, `prd.md > States and Boundaries` (Empty log).

### Map Overlay (`src/ui/map`)
Toggled by **M**. London atlas/compass styling, a labeled pin per ground, "You are here" on the current stadium, travel-mode choices (Bus) on clicking the destination pin. Clicking the current-stadium pin is inactive / shows a brief "you're already here" nudge.
PRD ref: `prd.md > The map and travel selection (M)`, `prd.md > States and Boundaries` (Already here).

### Journey Controller (`src/journey/`)
On Bus selection: hides overlays, animates the camera along a `CatmullRomCurve3` spline across the low-poly "London" geometry (~30s, sweeping/panoramic), plays the matchday soundscape, shows a Skip control, and on finish or skip hands off to `SceneManager` to load the destination exterior.
PRD ref: `prd.md > The journey simulation (the kernel)`, `scope.md > The Unique Kernel`.

### Log Store (`src/state/logStore.js`)
Thin wrapper over `localStorage`: `getCollected()`, `addCard(id)`, read-on-load. Single JSON key.
PRD ref: `prd.md > The collected-cards log (J)` (persists across sessions), `prd.md > States and Boundaries` (Persistence).

### Data (`src/data/`)
Static definitions: per-stadium zones (position + box size) and card content (drafted rivalry facts), plus the two map pins and the spline path. No live services.
PRD ref: `prd.md > Geofence info-zones and cards`, `prd.md > Product Decisions` (card text drafted by build).

## Data Model

All data is in-memory objects plus one persisted key. Nothing is on a server.

- **Stadium definition** (static, in `src/data/`): `{ id, name, colorTheme, spawn, zones[], cards{} }`.
- **Zone** (static): `{ id, label, box: {center, size}, cardId }`. Lives in code; checked against camera position each frame; never updated at runtime.
- **Card content** (static): `{ id, title, body }` — drafted rivalry facts, learner refines wording later (`prd.md > Product Decisions`).
- **Collected log** (persisted): a JSON array of collected card IDs under a single `localStorage` key, e.g. `matchday-hop:log`.
  - **Originates:** when a zone fires and the card shows.
  - **Stored:** `localStorage` (survives closing the browser).
  - **A → B:** `addCard(id)` reads the array, de-dupes, writes it back; the Log overlay reads it on **J**.
  - **Leave and come back:** on load, `getCollected()` reads the key; empty/missing → empty state, otherwise the saved cards reappear.
- **Runtime UI state** (in-memory, not persisted): which overlay is open, current stadium, whether a journey is playing.

## File Structure

```
basic_ai/
├── index.html                 # single page; mounts the canvas + overlay root
├── package.json               # three, vite
├── vite.config.js
├── public/
│   └── audio/
│       └── matchday-soundscape.*   # crowd/ambience loop for the journey
├── src/
│   ├── main.js                # entry: boot renderer, wire modules, start loop
│   ├── core/
│   │   ├── renderer.js        # WebGLRenderer + WebXR + render loop
│   │   └── sceneManager.js    # load/swap active stadium scene, place camera
│   ├── scenes/
│   │   ├── stamfordBridge.js  # blue stylized ground geometry + spawn
│   │   └── emirates.js        # red stylized ground geometry + spawn
│   ├── controls/
│   │   ├── firstPerson.js     # keyboard move + PointerLock look
│   │   └── tutorial.js        # progressive contextual control hints
│   ├── zones/
│   │   └── zoneSystem.js      # per-frame bounding-box enter checks
│   ├── journey/
│   │   ├── journeyController.js   # spline camera animation + skip + handoff
│   │   └── londonScene.js         # low-poly abstract city flythrough geometry
│   ├── ui/
│   │   ├── card.js            # non-blocking card overlay + auto-dismiss
│   │   ├── log.js             # J overlay, empty state
│   │   └── map.js             # M overlay, pins, "you are here", travel modes
│   ├── state/
│   │   └── logStore.js        # localStorage read/write wrapper
│   └── data/
│       ├── stadiums.js        # zones + card content per ground
│       └── mapConfig.js       # pins, labels, spline path
├── devpost/                   # Devpost learning workspace (specs, prd, etc.)
└── README.md
```

## External Services and Dependencies

None at runtime. No APIs, databases, hosting, or keys. The only external dependencies are build-time npm packages:

- **three** — [docs](https://threejs.org/docs/). Free, open source.
- **vite** — [docs](https://vitejs.dev/guide/). Free, open source.

Audio assets (matchday soundscape) are bundled locally in `public/audio/` — source a royalty-free crowd/ambience clip during the build; no runtime fetch.

## Important Failure Modes

- **WebXR/WebGL unsupported or canvas fails to init** → show a plain HTML message ("This experience needs a WebGL-capable desktop browser") instead of a blank screen; the 2D overlays and map still convey the concept.
- **Pointer lock not engaged (user hasn't clicked the canvas)** → movement/look feel dead; show a persistent "Click to look around" prompt until lock is acquired.
- **Audio blocked by browser autoplay policy** → the journey still plays silently; trigger audio on the Bus-selection click (a user gesture) so it's allowed, and don't let a missing/blocked clip stop the animation.
- **`localStorage` unavailable or corrupt JSON** → fall back to in-memory session log so the app still runs; the log simply won't persist that session.

## What Was Simplified and Why

- **localStorage instead of a hosted database** — same shape of data (a list of collected IDs), zero infrastructure, and it satisfies "persists across sessions." A real DB would add an account, a service, and a key for no POC benefit.
- **HTML/CSS overlays instead of in-world 3D panels** — crisper text and far faster to build for a desktop POC; in-world panels would be the fuller VR-native version but cost significant layout work that doesn't prove the kernel.
- **Abstract low-poly "London" instead of real geo-tiles** — a deliberate scope decision (`scope.md > Explicitly Cut`); keeps the flythrough genuinely 3D and immersive while buildable in the budget. The fuller version (Google 3D tiles) isn't WebXR-native and would blow the time budget.
- **Stylized bounding-box zones instead of real geofencing** — the "geofence" is a box-vs-camera check each frame; same trigger behavior, no GPS/map service. Reborn from the learner's AR-geofence work in VR form.
- **Bus as the only travel mode** — per `prd.md > Product Decisions`; flight deferred.
- **Card text as drafted stubs** — labeled as draft rivalry facts; learner refines wording later (not a blocker).

## Decisions and Open Issues

**Learner choices (consequential, agreed):**
- **Engine: Three.js** — direct control over the cinematic camera and stylized look, matching the learner's VR background. Tradeoff: more plumbing written by hand (render loop, controls, zone checks).
- **Build/run: Vite + local recording** — fast iteration + clean static bundle; no deployment for the POC. Tradeoff: one Node install.
- **Persistence: localStorage** — keeps cross-session log cheaply. (PRD flags this as first-to-drop if the build runs tight; staying in for now.)
- **Journey beat: scripted 3D camera flythrough over low-poly stylized London** — keeps the kernel genuinely immersive and panoramic while buildable. Tradeoff: a bit of in-between city geometry to build vs. a flat 2D transition.

**Implementation details derived (not learner-authored):** per-frame bounding-box zone checks, `PointerLockControls` for look, `CatmullRomCurve3` spline for the journey camera, HTML/CSS overlays over the canvas, single JSON `localStorage` key.

**One learner uncertainty discussed:** how the "geofence" translates into code for a WebXR scene without GPS. Clarified: each zone is an axis-aligned box in the scene, and the render loop checks the camera's position against those boxes every frame — the same enter-a-zone-unlock-content behavior from the learner's AR-geofencing work, now done against world coordinates instead of GPS.

**Open questions carried from `prd.md > Open Questions`:** exact card wording (build drafts stubs, learner refines — not blocking); factual confirmations for *later-tier* stadiums (not in this POC). Neither blocks the build.
