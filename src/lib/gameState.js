// Pure game-state logic for Where Am I? — no React, no DOM, fully unit-testable.
// This is the heart of the round loop; the UI (App) just dispatches to it.
// Functions accept an `rng` (default Math.random) so randomness is testable.
// See spec.md > Components > App and spec.md > The Core Journey Through the System.

import { haversineKm } from "./distance.js";

export const ROUNDS = 5;
const MAX_POINTS = 5000;
// Distance (km) at which points fall to half. Smaller = harsher scoring.
const HALF_LIFE_KM = 2000;
// Simulated AI opponent "skill": typical guess error in km. Larger = weaker AI.
export const AI_ERROR_KM = 600;

// Distance → points: MAX_POINTS for a perfect guess, decaying exponentially
// with distance, floored at 0. Rounded to a whole number.
export function scoreFromDistanceKm(distanceKm) {
  const points = MAX_POINTS * Math.pow(0.5, distanceKm / HALF_LIFE_KM);
  return Math.max(0, Math.round(points));
}

// Fisher–Yates shuffle returning a NEW array; pure given a deterministic rng.
export function shuffle(array, rng = Math.random) {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Build a shuffled order of location indices to play, length = min(ROUNDS, count).
function buildOrder(locationCount, rng) {
  const indices = Array.from({ length: locationCount }, (_, i) => i);
  return shuffle(indices, rng).slice(0, Math.min(ROUNDS, locationCount));
}

// The location index to show for the current round.
export function currentLocationIndex(state) {
  return state.order[state.roundIndex];
}

// Round number, 1-based.
export function roundNumber(state) {
  return state.roundIndex + 1;
}

// Simulated AI opponent guess: the true location nudged by a random offset
// whose magnitude is controlled by `errorKm` (skill). Honest scripted bot —
// it does NOT look at the rendered 3D scene. ~111 km per degree of latitude.
export function aiGuessForAnswer(answer, errorKm = AI_ERROR_KM, rng = Math.random) {
  const kmPerDegLat = 111;
  const kmPerDegLng = 111 * Math.cos((answer.lat * Math.PI) / 180) || 1;
  const bearing = rng() * 2 * Math.PI;
  const dist = rng() * errorKm * 1.5;
  const dLat = (dist * Math.cos(bearing)) / kmPerDegLat;
  const dLng = (dist * Math.sin(bearing)) / kmPerDegLng;
  return { lat: answer.lat + dLat, lng: answer.lng + dLng };
}

// phase: "exploring" | "revealed" | "finished"
export function initialState(rng = Math.random, locationCount = ROUNDS) {
  return {
    order: buildOrder(locationCount, rng), // shuffled location indices to play
    roundIndex: 0, // 0-based position within `order`
    guess: null,
    phase: "exploring",
    distanceKm: null,
    roundPoints: null,
    totalScore: 0,
    aiRoundPoints: null,
    aiTotalScore: 0,
    winner: null, // "you" | "ai" | "tie" (set when finished)
  };
}

export function isLocked(state) {
  return state.phase !== "exploring";
}

// Place and lock the player's pin, score it, AND resolve the AI opponent's
// guess for the same location — both add to their running totals.
export function placeGuess(state, latlng, locations, rng = Math.random) {
  if (isLocked(state)) return state;
  const answer = locations[currentLocationIndex(state)].answer;

  const distanceKm = haversineKm(latlng, answer);
  const roundPoints = scoreFromDistanceKm(distanceKm);

  const aiGuess = aiGuessForAnswer(answer, AI_ERROR_KM, rng);
  const aiRoundPoints = scoreFromDistanceKm(haversineKm(aiGuess, answer));

  return {
    ...state,
    guess: latlng,
    phase: "revealed",
    distanceKm,
    roundPoints,
    totalScore: state.totalScore + roundPoints,
    aiRoundPoints,
    aiTotalScore: state.aiTotalScore + aiRoundPoints,
  };
}

// Advance to the next round. After the final round, switch to "finished" and
// compute the winner. Otherwise move to the next shuffled location.
export function advance(state) {
  if (state.roundIndex >= state.order.length - 1) {
    return {
      ...state,
      phase: "finished",
      winner:
        state.totalScore > state.aiTotalScore
          ? "you"
          : state.totalScore < state.aiTotalScore
          ? "ai"
          : "tie",
    };
  }
  return {
    ...state,
    roundIndex: state.roundIndex + 1,
    guess: null,
    phase: "exploring",
    distanceKm: null,
    roundPoints: null,
    aiRoundPoints: null,
    // totals preserved across rounds.
  };
}

// Play again: full reset with a freshly shuffled order.
export function resetGame(rng = Math.random, locationCount = ROUNDS) {
  return initialState(rng, locationCount);
}
