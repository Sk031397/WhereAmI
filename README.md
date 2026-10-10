# Matchday Hop — The London Derby Hop

A desktop WebXR (headset-ready) experience built with Three.js + Vite. You stand
outside a stylized **Stamford Bridge**, explore inside and out, collect rivalry
info-cards from geofence zones, then open a London map and take a **cinematic Bus
journey** across the city to a stylized **Emirates** — and hop back. The journey
between grounds is the star.

Everything runs in the browser. No server, no accounts, no API keys. The only
persistence is your collected-cards log in `localStorage`.

## Run it

```
npm install
npm run dev      # opens a local dev URL, e.g. http://localhost:5173
```

Open the printed URL, **click the canvas** to capture the mouse, and move with
**WASD**. Press **J** for your collected-cards log and **M** for the map.

## Build a static bundle

```
npm run build    # outputs dist/
```

## Controls

- **Mouse** — look around (click to capture)
- **WASD / arrows** — move
- **J** — collected-cards log
- **M** — map and travel selection

## Tech

- [Three.js](https://threejs.org/) — WebGL render loop, scene graph, WebXR, PointerLockControls, CatmullRomCurve3 journey camera
- [Vite](https://vitejs.dev/) — dev server and static build

Stylized, original shapes and colours only — recognizable as "a stadium", not
replicas, and no real logos or brand colours.
