---
doc: prd
status: approved
---

# Matchday Hop — Product Requirements

One line: A desktop WebXR experience for football fans where you stand outside a vibrant, stylized London stadium, explore it inside and out, then travel to a rival ground via a cinematic journey simulation — the London Derby Hop between a stylized Stamford Bridge and a stylized Emirates.
Source: `scope.md > Matchday Hop (working title)`, `scope.md > The Unique Kernel`. The journey between grounds is the star; the stadiums are the setting.

## The Core Journey

The complete path, end to end. A stranger could follow these steps on screen.

1. **Arrive outside.** The experience loads with the camera framing a lit, full-capacity **Stamford Bridge** from the outside — directly or at a luminescent angle — with the player positioned as if about to approach and enter.
2. **Learn as you go.** A contextual tutorial surfaces controls progressively as the player moves: movement (WASD / arrow keys), then camera pan, then how to interact. It adapts to what the player is doing rather than front-loading everything.
3. **Approach and enter.** The player walks up to the stadium, crosses the entrance, and roams the bowl freely — like touring the individual shops in a mall. Movement is first-person; the player is the traveler (no avatar, no NPCs they control).
4. **Collect info-zones.** Scattered geofence trigger zones — some outside on the approach/plaza, some inside the bowl — pop a non-blocking info/stats card when entered. Cards carry rivalry facts and save to the player's log.
5. **Review the log.** Pressing **J** opens a log of collected cards at any time. The log persists across sessions.
6. **Open the map.** Pressing **M** brings up a London atlas / compass-styled map with labeled pins for both grounds and a "You are here" marker on the current stadium.
7. **Pick a destination and mode.** The player clicks the destination pin (Emirates). Travel-mode choices appear; the player selects **Bus**.
8. **Watch the journey (the kernel).** A cinematic, panoramic journey simulation plays — up to ~30 seconds — with sweeping views and a matchday soundscape (crowd chatter, ambient voices, people milling). It is skippable, and ends with the camera **arriving at the Emirates exterior**.
9. **Arrive and repeat.** The player is deposited outside the stylized **Emirates**, mirroring the opening beat — approach, enter, explore its own info-zones and rivalry cards. Open the map again to hop back.

## Screens and Surfaces

A single continuous first-person 3D world (desktop, keyboard/mouse), with overlay surfaces summoned by key presses:

- **The stadium world** — the immersive 3D scene: stadium exterior and interior bowl, with geofence zones placed in both.
- **The card panel** — a small non-blocking overlay that slides into the player's view when a zone is entered (see States and Boundaries).
- **The log (J)** — an overlay listing collected cards for later review.
- **The map (M)** — a London atlas / compass overlay with stadium pins, "You are here," and travel-mode selection.
- **The journey sequence** — a full-screen cinematic sequence that plays between stadiums and returns control at the destination exterior.

No invented screens beyond these.

## Look and Feel

Captured from the design beat; the build should use this and `4-spec` should not re-interview it.

- **Mood:** vibrant and saturated, playful and game-like — not photoreal. Energetic, arcade-leaning.
- **Team identity without infringement:** evoke each club with colors that *suggest* the team (a Chelsea-ish blue for Stamford Bridge, an Arsenal-ish red for the Emirates) **without using exact brand colors**. Use **generic / original stand and crest shapes** — recognizable as "the blue London ground" vs. "the red London ground" — not real logos, real stadium architecture, or replica geometry.
- **Deliberate constraint:** this is a conscious choice to avoid trademark/copyright issues for a public submission, consistent with `scope.md > Inspiration & Identity` ("stylized stadiums clearly recognizable as a stadium, not replicas").

## Features and Behavior

### Exploring a stadium (outside and in)
Source: `scope.md > The Core Loop`.
First-person movement around the stadium exterior and interior. The player can approach the stadium, cross the entrance, and walk freely through the bowl. Camera can pan freely.

- [ ] Player can move (forward/back/left/right) and pan the camera with keyboard/mouse.
- [ ] Player can cross from outside to inside the stadium by walking through the entrance.
- [ ] A contextual tutorial surfaces the relevant control hint as the player first needs it, and does not block movement.

### Geofence info-zones and cards
Source: `scope.md > The Core Loop`, `scope.md > The Unique Kernel` (reborn AR-geofencing).
2–3 trigger zones per stadium, placed across outside and inside. Entering a zone pops a card. Cards hold rivalry facts drafted by the build from established facts (Chelsea's Champions League trophy, Arsenal as current Premier League champions, overall trophy counts, West vs. North London, atmosphere) — the learner will refine wording later.

- [ ] Walking into a zone makes its card appear as a **non-blocking** panel that does not stop or alter movement.
- [ ] The card stays visible for roughly **5–10 seconds**, then times out on its own.
- [ ] Each triggered card is **saved to the player's log** for the session and beyond.
- [ ] Re-entering a zone can pop its card again.
- [ ] Stamford Bridge and Emirates zones show **different** content reflecting each club.

### The collected-cards log (J)
- [ ] Pressing **J** opens a log listing the cards the player has collected.
- [ ] The log **persists across sessions** (survives closing the browser/terminal and returning).
- [ ] With nothing collected yet, the log shows a **"No cards collected yet"** empty state.

### The map and travel selection (M)
Source: `scope.md > The Core Loop`.
- [ ] Pressing **M** opens a **London atlas / compass**-styled map.
- [ ] The map shows a **labeled pin per ground** and a **"You are here"** marker on the current stadium.
- [ ] Clicking the destination pin reveals **travel-mode choices**, including **Bus**.
- [ ] Selecting **Bus** launches the journey simulation.
- [ ] Clicking the **current** stadium's "You are here" pin does **not** launch a journey — it is inactive or gives a small "you're already here" nudge.

### The journey simulation (the kernel)
Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like` ("the bus journey animating across the city and depositing you, in VR, inside the rival's ground").
- [ ] After selecting Bus, a **cinematic, panoramic** sequence plays with sweeping views.
- [ ] A **matchday soundscape** plays during the journey: crowd chatter, ambient background voices, people milling.
- [ ] The sequence runs **up to ~30 seconds**.
- [ ] The player can **skip** the sequence.
- [ ] The sequence ends with the camera **arriving at the destination stadium's exterior**, returning the player to the approach-and-enter beat.

## States and Boundaries

- **Opening state** — camera framing a lit, full-capacity Stamford Bridge from outside; player positioned to approach; contextual tutorial begins.
- **Card showing** — non-blocking panel visible ~5–10s over normal movement; auto-dismisses.
- **Empty log** — pressing J before collecting anything shows "No cards collected yet."
- **Already here** — clicking the current stadium's pin on the map is inactive / shows a brief "you're already here" nudge.
- **In transit** — journey sequence playing; player watches or skips; ends at destination exterior.
- **Persistence** — the collected-cards log survives across sessions. (See Product Decisions — flagged as the lowest-priority POC feature.)
- **Platform** — desktop keyboard/mouse only for this POC; VR-headset controls deferred.

## Product Decisions

- **Outside-then-in, not inside-only** — the player starts outside and can walk in and roam, like touring shops in a mall. This expands scope's "start immersed inside" into an approach-and-enter beat on both ends of the journey.
- **Cards are non-blocking and time out (~5–10s)** — chosen so the card never interrupts play; it slides in, saves to the log, and the player keeps moving.
- **Log persists across sessions** — the learner explicitly chose cross-session persistence (J to open). Flagged as the feature that least serves the kernel; **first candidate to drop to session-only if the build runs tight** (agreed).
- **Bus is the only travel mode in the POC** — consistent with `scope.md > The POC Boundary`. Flight deferred.
- **Team colors evoked, not copied; generic shapes** — deliberate choice to avoid trademark/copyright exposure for a public submission.
- **Card text drafted by the build** — stub facts generated from established rivalry facts; learner refines wording later (not a blocker).
- **Desktop keyboard/mouse only** — VR-headset input deferred to the "headset-ready later" line in scope.

## What We're Building

- Opening scene: lit, full-capacity stylized Stamford Bridge exterior with the player positioned to approach.
- Contextual, progressive control tutorial (movement, camera pan, interact).
- First-person movement outside and inside both stadiums, with walk-in entrance transition.
- 2–3 geofence info-zones per stadium (outside and inside), each popping a non-blocking, auto-timing card with drafted rivalry facts.
- A collected-cards log opened with **J**, persisting across sessions, with an empty state.
- A London atlas/compass map opened with **M**: labeled pins, "You are here," destination selection, Bus travel-mode choice, and an inactive current-stadium pin.
- A skippable, ~30s cinematic panoramic journey simulation with matchday soundscape, ending at the destination exterior.
- Two stylized grounds — Stamford Bridge and Emirates — each with its own colors, zones, and cards; hop both directions.

## Deferred From the POC

- **Cross-session persistence of the log** — kept in for now per the learner's choice, but explicitly the first thing to drop to session-only if time is tight.
- **The other stadiums** (Tottenham, Camp Nou, Bernabéu, Mercedes-Benz, an LA stadium, Hard Rock) — later data drop-ins per `scope.md > Later`.
- **Flight travel mode** — for international/transatlantic hops, per scope.
- **VR-headset controls** — desktop only for the POC; headset-ready later.
- **NPCs / avatar / character animation** — player is a first-person camera; ambient journey voices are atmosphere, not characters you interact with. (`scope.md > Explicitly Cut`.)

## Possible Later Enhancements

- Richer, higher-fidelity stylized stadium models.
- A "day in the life of a fan" narrative layer across multiple hops.
- More travel modes and more atmospheric variety per route.

## Non-Goals

Source: `scope.md > Explicitly Cut`.
- **Real transit/flight/bus APIs** — a stylized simulation is the point and fits the time budget.
- **Google Photorealistic 3D Maps / real geo-tiles** — a conscious tradeoff toward true WebXR immersion.
- **Photoreal stadium replicas and real logos/brand colors** — stylized, original, non-infringing shapes and colors only.
- **NPC/avatar game-design layer** — out of the kernel.

## Open Questions

- **Factual confirmations for later stadiums** (not blocking this POC): Camp Nou is in Barcelona, Bernabéu in Madrid; "Crypto Stadium LA" = Crypto.com Arena (indoor) vs. a soccer venue like SoFi/BMO — confirm before adding in the Later tier. (`scope.md` open-items note.)
- **Exact card text** — build drafts stubs; learner to refine wording. Does not block `4-spec`.
