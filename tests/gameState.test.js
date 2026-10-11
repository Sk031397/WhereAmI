import { describe, it, expect } from "vitest";
import {
  initialState,
  isLocked,
  placeGuess,
  advance,
} from "../src/lib/gameState.js";

const locations = [
  { name: "A", answer: { lat: 48.8584, lng: 2.2945 } },
  { name: "B", answer: { lat: 41.8902, lng: 12.4922 } },
];

describe("guess locking (slice 2)", () => {
  it("starts unlocked with no guess", () => {
    const s = initialState();
    expect(isLocked(s)).toBe(false);
    expect(s.guess).toBeNull();
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

describe("scoring (slice 3)", () => {
  it("computes distance to the current location's answer on lock", () => {
    const s = placeGuess(initialState(), { lat: 48.8584, lng: 2.2945 }, locations);
    // Guess equals location A's answer, so distance is ~0.
    expect(s.phase).toBe("revealed");
    expect(s.distanceKm).toBeCloseTo(0, 3);
  });

  it("produces a positive distance for a wrong guess", () => {
    const s = placeGuess(initialState(), { lat: 0, lng: 0 }, locations);
    expect(s.distanceKm).toBeGreaterThan(0);
  });
});

describe("advance and loop (slice 4)", () => {
  it("moves to the next location and resets the guess", () => {
    const guessed = placeGuess(initialState(), { lat: 0, lng: 0 }, locations);
    const next = advance(guessed, locations);
    expect(next.currentIndex).toBe(1);
    expect(next.guess).toBeNull();
    expect(next.phase).toBe("exploring");
    expect(next.distanceKm).toBeNull();
  });

  it("wraps back to the first location after the last", () => {
    let s = { ...initialState(), currentIndex: locations.length - 1, phase: "revealed" };
    s = advance(s, locations);
    expect(s.currentIndex).toBe(0);
  });

  it("loops cleanly through the whole set and back", () => {
    let s = initialState();
    for (let i = 0; i < locations.length; i++) {
      s = advance(s, locations);
    }
    expect(s.currentIndex).toBe(0); // full lap returns to start
  });
});
