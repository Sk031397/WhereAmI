import { describe, it, expect } from "vitest";
import {
  initialState,
  isLocked,
  placeGuess,
  advance,
  resetGame,
  scoreFromDistanceKm,
  ROUNDS,
} from "../src/lib/gameState.js";

const locations = [
  { name: "A", answer: { lat: 48.8584, lng: 2.2945 } },
  { name: "B", answer: { lat: 41.8902, lng: 12.4922 } },
  { name: "C", answer: { lat: 40.6892, lng: -74.0445 } },
  { name: "D", answer: { lat: -33.8568, lng: 151.2153 } },
  { name: "E", answer: { lat: 25.1972, lng: 55.2744 } },
];

describe("guess locking (slice 2)", () => {
  it("starts unlocked at round 1 with no guess and zero total", () => {
    const s = initialState();
    expect(isLocked(s)).toBe(false);
    expect(s.guess).toBeNull();
    expect(s.round).toBe(1);
    expect(s.totalScore).toBe(0);
  });

  it("locks on the first pin placement", () => {
    const s = placeGuess(initialState(), { lat: 50, lng: 3 }, locations);
    expect(isLocked(s)).toBe(true);
    expect(s.guess).toEqual({ lat: 50, lng: 3 });
  });

  it("ignores a second placement (one guess, no undo)", () => {
    const first = placeGuess(initialState(), { lat: 50, lng: 3 }, locations);
    const second = placeGuess(first, { lat: 10, lng: 10 }, locations);
    expect(second.guess).toEqual({ lat: 50, lng: 3 });
  });
});

describe("scoring (slice 3 + 5)", () => {
  it("computes distance to the current location's answer on lock", () => {
    const s = placeGuess(initialState(), { lat: 48.8584, lng: 2.2945 }, locations);
    expect(s.phase).toBe("revealed");
    expect(s.distanceKm).toBeCloseTo(0, 3);
  });

  it("produces a positive distance for a wrong guess", () => {
    const s = placeGuess(initialState(), { lat: 0, lng: 0 }, locations);
    expect(s.distanceKm).toBeGreaterThan(0);
  });

  it("awards max points for a perfect guess and fewer as distance grows", () => {
    expect(scoreFromDistanceKm(0)).toBe(5000);
    const near = scoreFromDistanceKm(100);
    const far = scoreFromDistanceKm(5000);
    expect(near).toBeLessThan(5000);
    expect(far).toBeLessThan(near);
    expect(far).toBeGreaterThanOrEqual(0);
  });

  it("records round points and adds them to the running total", () => {
    const s = placeGuess(initialState(), { lat: 48.8584, lng: 2.2945 }, locations);
    expect(s.roundPoints).toBe(5000);
    expect(s.totalScore).toBe(5000);
  });
});

describe("rounds, tally, and reset (slice 5)", () => {
  it("advances to the next round and location, keeping the running total", () => {
    const guessed = placeGuess(initialState(), { lat: 48.8584, lng: 2.2945 }, locations);
    const next = advance(guessed, locations);
    expect(next.round).toBe(2);
    expect(next.currentIndex).toBe(1);
    expect(next.phase).toBe("exploring");
    expect(next.guess).toBeNull();
    expect(next.totalScore).toBe(5000); // preserved across rounds
  });

  it("accumulates the total across several rounds", () => {
    let s = initialState();
    s = placeGuess(s, { lat: 48.8584, lng: 2.2945 }, locations); // perfect, +5000
    s = advance(s, locations);
    s = placeGuess(s, { lat: 41.8902, lng: 12.4922 }, locations); // perfect, +5000
    expect(s.totalScore).toBe(10000);
    expect(s.round).toBe(2);
  });

  it("finishes after the final round instead of wrapping", () => {
    let s = initialState();
    for (let r = 0; r < ROUNDS; r++) {
      s = placeGuess(s, locations[s.currentIndex].answer, locations);
      s = advance(s, locations);
    }
    expect(s.phase).toBe("finished");
    expect(s.round).toBe(ROUNDS);
    expect(s.totalScore).toBe(5000 * ROUNDS);
  });

  it("play-again resets to round 1 with a zero total", () => {
    let s = initialState();
    s = placeGuess(s, { lat: 48.8584, lng: 2.2945 }, locations);
    s = advance(s, locations);
    const reset = resetGame();
    expect(reset.round).toBe(1);
    expect(reset.totalScore).toBe(0);
    expect(reset.phase).toBe("exploring");
    expect(reset.currentIndex).toBe(0);
  });
});
