---
doc: scope
status: approved
---

# Matchday Hop (working title)

One line: A web-based WebXR experience where you stand immersed inside stylized football stadiums and travel between them, with the journey itself—a stylized bus/flight simulation—as the star of the show.

## The Unique Kernel
The **travel between arenas is the experience**, not the arenas themselves. You pick a destination stadium, choose a transit mode, and a stylized FIFA-career-mode-style journey simulation plays (route animating across the map, bus/flight ambience and sounds, a transition sequence) before you arrive immersed in the next ground. Delete the journey sim and it's just a stadium viewer—so the journey is the kernel.

## Who It's For
A football/soccer fan like the learner—a Chelsea and Barcelona supporter—who enjoys the *ritual and travel* of matchday, not just the match. Someone who'd love an interactive, game-like way to "hop" between the grounds of teams they follow. Today they watch matches on TV and imagine the away-day experience; there's no playful, immersive way to travel the football world from a browser.

## The Core Loop
First-person (you are the traveler—no avatar, no NPCs): **look around a stadium → walk into a geofence trigger zone → an info/stats card pops up → open the map and pick the next stadium → choose a travel mode → watch the journey simulation play → arrive immersed in the next stadium.** You come back to hop to another ground and see its scene + info zones.

## Inspiration & Identity
- FIFA career-mode transfer/transition simulators (the stylized "journey in progress" feel).
- The learner's past AR-geofencing work—trigger zones that unlock content when you enter them, reborn in VR.
- Mood: playful, game-like, immersive but not photoreal. Stylized stadiums that are clearly recognizable as "a stadium," not replicas.
- Tech identity: browser-native WebXR (works on desktop with mouse/keyboard; headset-ready later), not a Google Photorealistic 3D Maps scene.

## Why This Matters to the Learner
The learner is a big Premier League fan (Chelsea, Stamford Bridge) and a Barcelona fan, with deep VR/AR and geofencing experience. This revisits their AR-geofence background in an immersive web form and lets them explore immersive geospatial interaction hands-on. Stated interest: understanding immersive/geospatial web tech and building something that feels like a game.

## What "Working" Looks Like
On screen in about a minute, in a browser: you start immersed inside a stylized **Stamford Bridge**, look around, walk into 2–3 geofence info-zones that pop up cards, open a London map, select **Emirates Stadium**, choose **bus**, and watch a short journey simulation (route hops across London, bus ambience/sounds, transition) before arriving immersed inside a stylized **Emirates**. 
The "oh, that's cool" beat: **the bus journey animating across the city and depositing you, in VR, inside the rival's ground.**

## The POC Boundary
In:
- Exactly **two stadiums**: stylized **Stamford Bridge** and stylized **Emirates** (both London; the "London Derby Hop").
- First-person WebXR camera with desktop mouse/keyboard fallback.
- **2–3 geofence trigger zones per stadium** that pop up an info/stats card on entry.
- A simple **map/selection screen** to choose the next stadium.
- **One travel mode headlined: bus**, with a stylized journey simulation (route animation across London + ambience/sound + transition).

## Later
- The remaining stadiums as drop-in data: Tottenham Hotspur Stadium, Camp Nou (Barcelona), Santiago Bernabéu (Madrid), Mercedes-Benz Stadium (Atlanta), an LA stadium (Crypto.com Arena or SoFi—TBD), Hard Rock Stadium (Miami).
- **Flight** travel mode for international/transatlantic hops (takeoff/cruise sounds, longer transition).
- NPCs, a modeled main character, "day in the life of a fan" narrative layer.
- Richer, higher-fidelity stadium models.

## Explicitly Cut
- **Real flight/bus/transit APIs** — would blow the 2–4 hour budget and aren't needed; a stylized simulation is cooler and more game-like anyway.
- **NPCs and avatar/character animation** — a whole game-design layer that isn't the kernel; player is a first-person camera.
- **Google Photorealistic 3D Maps / real geo-tiles** — not natively WebXR; chose a WebXR engine for true immersion instead (noted as a conscious tradeoff away from the Google-APIs learning goal in favor of the VR feel).
- **Photoreal stadium replicas** — stylized recognizable stadiums are enough to prove the loop.

<!-- Open factual items to confirm in PRD/later: Camp Nou is in Barcelona and Bernabéu in Madrid (learner slip said Camp Nou in Madrid); "Crypto Stadium LA" = Crypto.com Arena (indoor NBA arena) vs. a soccer venue like SoFi/BMO — confirm before adding these in the Later tier. -->
