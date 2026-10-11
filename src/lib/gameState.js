// Pure game-state logic for Where Am I? — no React, no DOM, fully unit-testable.
// This is the heart of the round loop; the UI (App) just dispatches to it.
// See spec.md > Components > App and spec.md > The Core Journey Through the System.

import { haversineKm } from "./distance.js";

// phase: "exploring" (no guess yet) | "revealed" (pin locked, score shown)
export function initialState() {
  return {
    currentIndex: 0,
    guess: null, // { lat, lng }
    phase: "exploring",
    distanceKm: null,
  };
}

export function isLocked(state) {
  return state.phase !== "exploring";
}

// Place and lock the pin, scoring it against the current location's answer.
// Ignored if already locked (one guess per round, instant lock, no undo).
export function placeGuess(state, latlng, locations) {
  if (isLocked(state)) return state;
  const answer = locations[state.currentIndex].answer;
  return {
    ...state,
    guess: latlng,
    phase: "revealed",
    distanceKm: haversineKm(latlng, answer),
  };
}

// Advance to the next location, wrapping back to the first after the last,
// and reset the guess so the next round starts clean.
export function advance(state, locations) {
  const nextIndex = (state.currentIndex + 1) % locations.length;
  return {
    ...initialState(),
    currentIndex: nextIndex,
  };
}
