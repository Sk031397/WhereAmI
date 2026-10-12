import { describe, it, expect } from "vitest";
import {
  initialState,
  isLocked,
  placeGuess,
  advance,
  resetGame,
  shuffle,
  scoreFromDistanceKm,
  aiGuessForAnswer,
  currentLocationIndex,
  roundNumber,
  ROUNDS,
} from "../src/lib/gameState.js";
import { haversineKm } from "../src/lib/distance.js";

const locations = [
  { name: "A", answer: { lat: 48.8584, lng: 2.2945 } },
  { name: "B", answer: { lat: 41.8902, lng: 12.4922 } },
  { name: "C", answer: { lat: 40.6892, lng: -74.0445 } },
  { name: "D", answer: { lat: -33.8568, lng: 151.2153 } },
  { name: "E", answer: { lat: 25.1972, lng: 55.2744 } },
];

// A deterministic rng for reproducible tests.
function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("guess locking", () => {
  it("starts unlocked at round 1 with zero totals", () => {
    const s = initialState(seededRng(1), locations.length);
    expect(isLocked(s)).toBe(false);
    expect(roundNumber(s)).toBe(1);
    expect(s.totalScore).toBe(0);
    expect(s.aiTotalScore).toBe(0);
  });

  it("locks on first placement, ignores the second", () => {
    const first = placeGuess(initialState(seededRng(1), locations.length), { lat: 50, lng: 3 }, locations, seededRng(2));
    const second = placeGuess(first, { lat: 10, lng: 10 }, locations, seededRng(3));
    expect(isLocked(first)).toBe(true);
    expect(second.guess).toEqual({ lat: 50, lng: 3 });
  });
});

describe("shuffle and order", () => {
  it("is a permutation: same elements, possibly reordered", () => {
    const input = [0, 1, 2, 3, 4];
    const out = shuffle(input, seededRng(42));
    expect(out).toHaveLength(5);
    expect([...out].sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it("builds an order that is a permutation of all location indices", () => {
    const s = initialState(seededRng(7), locations.length);
    expect(s.order).toHaveLength(Math.min(ROUNDS, locations.length));
    expect([...s.order].sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it("does not mutate the input array", () => {
    const input = [0, 1, 2];
    shuffle(input, seededRng(9));
    expect(input).toEqual([0, 1, 2]);
  });
});

describe("scoring", () => {
  it("awards max points for a perfect guess, fewer as distance grows", () => {
    expect(scoreFromDistanceKm(0)).toBe(5000);
    expect(scoreFromDistanceKm(5000)).toBeLessThan(scoreFromDistanceKm(100));
  });

  it("scores the player's guess against the current shuffled location", () => {
    const s0 = initialState(seededRng(1), locations.length);
    const answer = locations[currentLocationIndex(s0)].answer;
    const s = placeGuess(s0, answer, locations, seededRng(2));
    expect(s.distanceKm).toBeCloseTo(0, 3);
    expect(s.roundPoints).toBe(5000);
    expect(s.totalScore).toBe(5000);
  });
});

describe("simulated AI opponent", () => {
  it("guesses near the true location (within plausible error)", () => {
    const answer = { lat: 48.8584, lng: 2.2945 };
    const guess = aiGuessForAnswer(answer, 600, seededRng(5));
    const off = haversineKm(guess, answer);
    expect(off).toBeGreaterThanOrEqual(0);
    expect(off).toBeLessThan(1200); // under ~1.5x error
  });

  it("accumulates an AI total alongside the player's each round", () => {
    const s0 = initialState(seededRng(1), locations.length);
    const answer = locations[currentLocationIndex(s0)].answer;
    const s = placeGuess(s0, answer, locations, seededRng(5));
    expect(s.aiRoundPoints).toBeGreaterThanOrEqual(0);
    expect(s.aiTotalScore).toBe(s.aiRoundPoints);
  });

  it("exposes the AI's guess latlng so it can be drawn on the map", () => {
    const s0 = initialState(seededRng(1), locations.length);
    const answer = locations[currentLocationIndex(s0)].answer;
    const s = placeGuess(s0, answer, locations, seededRng(5));
    expect(s.aiGuess).toHaveProperty("lat");
    expect(s.aiGuess).toHaveProperty("lng");
    expect(Number.isFinite(s.aiGuess.lat)).toBe(true);
    expect(Number.isFinite(s.aiGuess.lng)).toBe(true);
  });
});

describe("rounds, winner, and reset", () => {
  it("advances through the shuffled order and keeps totals", () => {
    const s0 = initialState(seededRng(1), locations.length);
    const guessed = placeGuess(s0, { lat: 0, lng: 0 }, locations, seededRng(2));
    const next = advance(guessed);
    expect(roundNumber(next)).toBe(2);
    expect(next.phase).toBe("exploring");
    expect(next.totalScore).toBe(guessed.totalScore);
    expect(next.aiTotalScore).toBe(guessed.aiTotalScore);
  });

  it("finishes after the final round and declares a winner", () => {
    let s = initialState(seededRng(1), locations.length);
    // Player guesses perfectly every round → player should win.
    for (let r = 0; r < ROUNDS; r++) {
      const answer = locations[currentLocationIndex(s)].answer;
      s = placeGuess(s, answer, locations, seededRng(r + 10));
      s = advance(s);
    }
    expect(s.phase).toBe("finished");
    expect(s.totalScore).toBe(5000 * ROUNDS);
    expect(s.winner).toBe("you"); // perfect player beats an error-prone AI
  });

  it("declares the AI the winner when the player guesses badly", () => {
    let s = initialState(seededRng(1), locations.length);
    for (let r = 0; r < ROUNDS; r++) {
      // Player guesses the South Pole every round → near-zero points.
      s = placeGuess(s, { lat: -89, lng: 0 }, locations, seededRng(r + 10));
      s = advance(s);
    }
    expect(s.phase).toBe("finished");
    expect(s.winner).toBe("ai");
  });

  it("play-again reshuffles and resets both totals", () => {
    const reset = resetGame(seededRng(99), locations.length);
    expect(roundNumber(reset)).toBe(1);
    expect(reset.totalScore).toBe(0);
    expect(reset.aiTotalScore).toBe(0);
    expect(reset.phase).toBe("exploring");
    expect([...reset.order].sort()).toEqual([0, 1, 2, 3, 4]);
  });
});
