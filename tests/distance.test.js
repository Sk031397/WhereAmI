import { describe, it, expect } from "vitest";
import { haversineKm } from "../src/lib/distance.js";

describe("haversineKm (slice 3)", () => {
  it("is zero for identical points", () => {
    const p = { lat: 48.8584, lng: 2.2945 };
    expect(haversineKm(p, p)).toBeCloseTo(0, 5);
  });

  it("matches a known pair: Paris to Rome (~1105 km)", () => {
    const paris = { lat: 48.8584, lng: 2.2945 };
    const rome = { lat: 41.8902, lng: 12.4922 };
    const d = haversineKm(paris, rome);
    expect(d).toBeGreaterThan(1080);
    expect(d).toBeLessThan(1130);
  });

  it("matches a known pair: New York to Sydney (~15,990 km)", () => {
    const ny = { lat: 40.6892, lng: -74.0445 };
    const sydney = { lat: -33.8568, lng: 151.2153 };
    const d = haversineKm(ny, sydney);
    expect(d).toBeGreaterThan(15800);
    expect(d).toBeLessThan(16200);
  });

  it("is symmetric", () => {
    const a = { lat: 10, lng: 20 };
    const b = { lat: -30, lng: 100 };
    expect(haversineKm(a, b)).toBeCloseTo(haversineKm(b, a), 6);
  });
});
