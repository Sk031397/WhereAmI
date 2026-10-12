---
doc: prd
status: approved
---

# Where Am I? — Product Requirements

One line: a photorealistic 3D "guess the location" game — you drop into a real place, fly around to read the clues, and pin your guess on a world map to see how close you were.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`.

## The Core Journey
Develops `scope.md > The Core Loop` and `scope.md > What "Working" Looks Like`.

1. The player opens the game and drops straight into a photorealistic 3D location with no label. The 3D view fills the screen; a small world-map panel sits in a corner.
2. The player flies and looks around the 3D scene, reading landmarks and layout for clues to where they are.
3. When they recognize (or reason out) the place, they click the corner map to drop a pin. The pin locks instantly — one guess per round, no confirm step and no undo.
4. The result reveals: a distance number showing how far the guess was from the real location, and the true location shown on the map alongside the player's pin.
5. The result lingers for about 5 seconds. The 3D world stays live and flyable during the reveal. Then the game auto-advances to the next location.
6. The game runs a fixed set of **5 rounds**. Each round's points (derived from the guess distance) add to a running total shown on the scoreboard. After the 5th round, a **final tally screen** shows the total score and a **play-again** button that resets to round 1.

## Screens and Layout
A single play surface. No separate menus or result screens — the result is an overlay on the same screen.

- **Main play surface** — the photorealistic 3D view fills the screen (the star of the frame). A small world-map panel floats in a corner for reading position and dropping the pin.
- **Result reveal** — an overlay on the same surface: the distance readout appears as a bold scoreboard-style element, and the corner map updates to show the player's pin and the true location together. The 3D view remains interactive underneath.

## Look and Feel
Develops `scope.md > Inspiration & Identity`.

Game-like personality in the behavior — a bold scoreboard and a punchy result reveal — wrapped in a cinematic, immersive-luxury frame. The realism of the 3D world is the star; the UI is expensive-feeling, not noisy.

- **Framing** — floating panels with deep, soft drop shadows that visually separate them from the live 3D canvas. Generous whitespace inside panels.
- **Typography** — elegant, wider-spaced, editorial typography.
- **Color palette** — warm dark tones (charcoal / deep espresso) paired with soft off-whites.
- **Avoid** — generic AI-app default styling; cramped or busy overlays that compete with the 3D scene.

## Features and Behavior

A single surface and a single loop, so the behavior is described directly rather than split into areas.

- **Fly and explore the 3D scene.** The player can freely move and look around the photorealistic 3D location to find clues.
  - [ ] On load, the player is placed in a 3D location with no name or label shown.
  - [ ] The player can move/look around the scene to view it from different angles.

- **Drop a pin to guess.** The corner world-map panel is always on screen; the player clicks it to place their guess.
  - [ ] Clicking the map places a pin at that spot.
  - [ ] The pin locks on the first placement — the guess is committed instantly, with no confirm and no second attempt that round.

- **See how close you were.** Immediately after the pin locks, the result reveals.
  - [ ] A distance number is shown (how far the guess was from the true location, e.g. "180 km off").
  - [ ] The guess is converted to points (closer = more points) and shown alongside the distance.
  - [ ] A running total of points so far is shown.
  - [ ] The true location appears on the map alongside the player's pin.
  - [ ] The reveal is presented with bold, scoreboard-style emphasis.

- **Play five rounds, then see a final tally.** The game has a fixed length.
  - [ ] A round indicator shows progress (e.g. "Round 3 of 5").
  - [ ] After the 5th round's reveal, a final tally screen shows the total score.
  - [ ] A play-again action resets the running total and returns to round 1.

- **Auto-advance between rounds.** After each of the first four reveals, the game continues on its own.
  - [ ] The result lingers for ~5 seconds before advancing.
  - [ ] The 3D view remains interactive (flyable) during the reveal.
  - [ ] After the linger, the game automatically loads the next hand-picked location — except after round 5, which shows the tally instead.

## States and Boundaries

- **First use / arrival** — the player lands directly in the first 3D location. No menu, no instructions screen; the always-present corner map signals how to guess.
- **Exploring (pre-guess)** — 3D view active, corner map shown, no pin placed yet, no result.
- **Guess locked** — the moment a pin is placed; the guess is final for the round.
- **Result reveal** — distance number + true location shown; 3D view still interactive; ~5-second linger.
- **End of the set** — after the 5th round's reveal, a final tally screen shows the total score with a play-again button.
- **No persistence** — nothing is remembered between sessions. Closing and reopening (or play-again) starts fresh at round 1. (Consistent with `scope.md > Explicitly Cut`.)

## Product Decisions

- **Map always visible as a corner panel** — the player decided the world map is always on screen (not triggered), as a small corner minimap over the big 3D view.
- **Result = distance number plus points** — the player chose a distance readout, and gamified it with a distance-based point score for arcade feel.
- **Running total over a fixed 5 rounds, then a tally** — the player chose to pull running score + final tally from Later into the POC, replacing the infinite loop with a 5-round game and a play-again reset.
- **True location revealed on the map** — alongside the distance, the real spot is shown next to the player's pin, for the "that's where I actually was" payoff.
- **Instant pin lock, no confirm** — the player chose for the pin to lock on drop. Tradeoff acknowledged: a misclick ends the round, which raises the stakes and makes the reveal the whole payoff.
- **Auto-advance with ~5-second linger** — the player chose auto-advance, held long enough (~5s) for the reveal to land; the 3D world stays live during it to keep immersion unbroken.
- **Cinematic immersive-luxury framing with game-like personality** — the player chose bold scoreboard/punchy reveal behavior inside a warm-dark, editorial, soft-shadowed luxury frame.
- **No persistence** — fresh start each session, by the player's choice and consistent with scope.

## What We're Building
- A single play surface: a photorealistic 3D location filling the screen, with an always-visible corner world-map panel.
- Free look/fly movement in the 3D scene.
- A small, hand-picked set of recognizable real locations (at least 5, for the fixed round count).
- Click-to-drop pin on the corner map that locks instantly as the final guess.
- A result reveal: distance number + points earned + running total + true location shown with the player's pin, in a bold scoreboard style, with a "Round N of 5" indicator.
- ~5-second result linger with the 3D view still interactive, then auto-advance — except after round 5.
- A final tally screen after round 5 with the total score and a play-again reset.
- Cinematic immersive-luxury UI framing (soft-shadowed floating panels, editorial type, warm dark palette with off-whites).

## Deferred From the POC
- **Larger / randomized location pool** — the POC uses a small hand-picked set; a bigger or randomized pool comes later. (From `scope.md > Later`.)
- **Difficulty levels** — famous vs. obscure spots; not needed to prove recognition. (From `scope.md > Later`.)
- **Accounts / persistence** — nothing saved between sessions in the POC; the running score resets on play-again or refresh. (From `scope.md > Explicitly Cut`.)

## Possible Later Enhancements
- Multiplayer / head-to-head guessing.
- Leaderboards and sharing results.
- Larger, randomized, or themed location pools and difficulty tiers.
- Per-round speed bonuses and streaks.

## Non-Goals
- **AR / real-world walking** — this is a sit-at-a-screen experience; AR is a different build. (`scope.md > Explicitly Cut`.)
- **Turn-by-turn navigation / directions** — the interest is spatial exploration, not routing. (`scope.md > Explicitly Cut`.)
- **Retro / historical visual styling** — the photorealism is the point. (`scope.md > Explicitly Cut`.)
- **A confirm/undo step on the guess** — intentionally omitted; the pin locks on drop.

## Open Questions
- None. (The earlier end-of-set question is resolved: 5 fixed rounds → final tally → play-again.)
