// Pure game-state logic for Where Am I? — no React, no DOM, fully unit-testable.
// This is the heart of the round loop; the UI (App) just dispatches to it.
// See spec.md > Components > App and spec.md > The Core Journey Through the System.

import { haversineKm } from "./distance.js";

export const ROUNDS = 5;
const MAX_POINTS = 5000;
// Distance (km) at which points fall to half. Smaller = harsher scoring.
const HALF_LIFE_KM = 2000;

// Distance → points: MAX_POINTS for a perfect guess, decaying exponentially
// with distance, floored at 0. Rounded to a whole number.
export function scoreFromDistanceKm(distanceKm) {
  const points = MAX_POINTS * Math.pow(0.5, distanceKm / HALF_LIFE_KM);
  return Math.max(0, Math.round(points));
}

// phase: "exploring" (no guess yet) | "revealed" (pin locked, score shown)
// | "finished" (all rounds done, tally shown)
export function initialState() {
  return {
    currentIndex: 0,
    round: 1, // 1-based round counter
    guess: null, // { lat, lng }
    phase: "exploring",
    distanceKm: null,
    roundPoints: null, // points earned this round
    totalScore: 0, // running total across rounds
  };
}

export function isLocked(state) {
  return state.phase !== "exploring";
}

// Place and lock the pin, scoring it against the current location's answer and
// adding the round's points to the running total.
// Ignored if already locked (one guess per round, instant lock, no undo).
export function placeGuess(state, latlng, locations) {
  if (isLocked(state)) return state;
  const answer = locations[state.currentIndex].answer;
  const distanceKm = haversineKm(latlng, answer);
  const roundPoints = scoreFromDistanceKm(distanceKm);
  return {
    ...state,
    guess: latlng,
    phase: "revealed",
    distanceKm,
    roundPoints,
    totalScore: state.totalScore + roundPoints,
  };
}

// Advance to the next round. After the final round, switch to the "finished"
// phase (tally) instead of continuing. Otherwise move to the next location and
// reset the per-round guess fields while preserving the running total.
export function advance(state, locations) {
  if (state.round >= ROUNDS) {
    return { ...state, phase: "finished" };
  }
  const nextIndex = (state.currentIndex + 1) % locations.length;
  return {
    ...state,
    currentIndex: nextIndex,
    round: state.round + 1,
    guess: null,
    phase: "exploring",
    distanceKm: null,
    roundPoints: null,
    // totalScore preserved across rounds.
  };
}

// Play again: full reset back to round 1 with a zero total.
export function resetGame() {
  return initialState();
}
