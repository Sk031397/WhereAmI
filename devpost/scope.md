---
doc: scope
status: approved
---

# Where Am I? — Guess the Place in Real 3D

One line: You get dropped into a real, photorealistic 3D location, fly around to look, and drop a pin on the world map to guess where you are.

## The Unique Kernel
The thrill of recognition. The whole game lives in the moment you fly into a real 3D place and go "wait — that's *my* city / that's that landmark." Because the location is real and recognizable, exploring it in 3D is the game. Swap the real 3D world for a made-up one and the magic is gone — that's how you know this is the kernel.

## Who It's For
Someone like you: a maps-and-places person who gets a kick out of recognizing somewhere real. They love the "I've been there / I know that skyline" feeling. Today they get a lighter version of this from GeoGuessr's street-view stills, but they want to actually *fly through* a place in 3D, not click through flat photos.

## The Core Loop
You're dropped into a photorealistic 3D location with no label. You fly and look around, reading the landmarks and layout for clues. When you think you know where you are, you drop a pin on a world map. One guess per round — you see how close you were, then move to the next place. You come back for the "aha" of recognizing somewhere and the pull of "one more place."

## Inspiration & Identity
- **GeoGuessr** — the core guess-your-location loop and the drop-a-pin answer mechanic, reimagined with flyable 3D instead of street-view stills.
- **Google Earth / photorealistic 3D maps** — the "fly into a real place" feel is the draw.
- Energy: the delight of recognition and a little showing-off ("I knew that was it").
<!-- 3-prd will fill visual/look-and-feel gaps in 1-2 questions. -->

## Why This Matters to the Learner
Maps and directions have always pulled at you, and the spatial side especially. This fuses that with gaming into something you'd actually want to pull up and play — and it's a clean vehicle for the real goal: driving an AI agent through a full workflow end to end and proving it works with rigorous testing.

## What "Working" Looks Like
Someone opens it, gets dropped into a real 3D place, flies around, recognizes (or reasons out) where it is, drops a pin, and sees how close their guess was. The "oh, that's cool" beat: flying into a recognizable real location in 3D and the jolt of "I know this place" — then confirming it with the pin.

## The POC Boundary
In scope — the minimum to prove the recognition kernel and the guess loop:
- Load a real, photorealistic 3D location the player can look around / fly in.
- A small hand-picked set of recognizable locations (enough to demo a round or two).
- Drop-a-pin world map for guessing.
- Score/feedback for a single guess: how close you were, as both a distance and points.
- A fixed set of 5 rounds with a running score, then a final tally screen and play-again.

## Later
- Larger / randomized pool of locations.
- Difficulty levels (famous landmarks vs. obscure spots).
- Multiplayer / head-to-head.
- Leaderboards and sharing results.

## Explicitly Cut
- **AR / real-world walking.** You chose sit-at-a-screen; AR is a different build entirely and not needed to prove the kernel.
- **Turn-by-turn navigation / directions.** The interest is spatial exploration, not routing.
- **Retro/historical visual styling.** Considered, then set aside in favor of the gaming direction; the realism *is* the point here.
- **Account systems / persistence.** Not needed to demonstrate the core loop in a 60-second video.
