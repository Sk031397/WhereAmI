import * as THREE from 'three';

/**
 * Map + journey configuration.
 * - `pins`: where each ground sits on the 2D London map overlay (percentages
 *   of the map box) plus its label and theme colour.
 * - `splinePoints`: control points for the CatmullRomCurve3 the journey
 *   camera flies along over the low-poly "London" (spec.md > Journey
 *   Controller). The path sweeps up and across the city and descends toward
 *   the destination.
 */

export const MAP_PINS = {
  'stamford-bridge': {
    id: 'stamford-bridge',
    name: 'Stamford Bridge',
    sub: 'West London · Blue',
    // position on the map overlay (left%, top%)
    x: 34,
    y: 70,
    color: '#1f6fe0',
  },
  emirates: {
    id: 'emirates',
    name: 'Emirates',
    sub: 'North London · Red',
    x: 60,
    y: 30,
    color: '#e8402a',
  },
};

export const TRAVEL_MODES = [
  { id: 'bus', label: 'Bus', emoji: '\uD83D\uDE8C', available: true },
];

/**
 * A sweeping camera path over the city. Starts low near the origin (just
 * outside the departure ground), rises for a panoramic city sweep, banks
 * across, then descends toward the arrival point. Reused for both
 * directions; the controller reverses/aims it as needed.
 */
export const JOURNEY_SPLINE = [
  new THREE.Vector3(0, 3, 60),
  new THREE.Vector3(-40, 28, 20),
  new THREE.Vector3(-20, 55, -60),
  new THREE.Vector3(45, 60, -140),
  new THREE.Vector3(30, 30, -220),
  new THREE.Vector3(0, 6, -275),
];

export const JOURNEY_DURATION = 30; // seconds (prd: up to ~30s)
