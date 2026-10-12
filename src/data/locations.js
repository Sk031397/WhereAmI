// Hand-picked set of recognizable real locations.
// See spec.md > Data Model. `name` is internal (NOT shown to the player until
// the reveal). `camera` is where the Google 3D view starts; `answer` is the
// true location for scoring. `hints` are two escalating clues (vague → specific)
// surfaced by the point-costing Hint button.
//
// NOTE: camera values are hand-tuned starting points to frame each landmark.
// Altitude/range are in meters. Tune further during the hands-on checkpoint if a
// view doesn't feel recognizable enough.
export const locations = [
  {
    name: "Eiffel Tower, Paris",
    camera: {
      center: { lat: 48.8584, lng: 2.2945, altitude: 180 },
      range: 900,
      tilt: 65,
      heading: 30,
    },
    answer: { lat: 48.8584, lng: 2.2945 },
    hints: ["Western Europe", "France"],
  },
  {
    name: "Colosseum, Rome",
    camera: {
      center: { lat: 41.8902, lng: 12.4922, altitude: 120 },
      range: 700,
      tilt: 60,
      heading: 150,
    },
    answer: { lat: 41.8902, lng: 12.4922 },
    hints: ["Southern Europe, on a peninsula", "Italy"],
  },
  {
    name: "Statue of Liberty, New York",
    camera: {
      center: { lat: 40.6892, lng: -74.0445, altitude: 150 },
      range: 800,
      tilt: 60,
      heading: 200,
    },
    answer: { lat: 40.6892, lng: -74.0445 },
    hints: ["Eastern coast of North America", "New York City, USA"],
  },
  {
    name: "Sydney Opera House",
    camera: {
      center: { lat: -33.8568, lng: 151.2153, altitude: 130 },
      range: 750,
      tilt: 62,
      heading: 300,
    },
    answer: { lat: -33.8568, lng: 151.2153 },
    hints: ["Southern Hemisphere, by the coast", "Sydney, Australia"],
  },
  {
    name: "Burj Khalifa, Dubai",
    camera: {
      center: { lat: 25.1972, lng: 55.2744, altitude: 400 },
      range: 1200,
      tilt: 55,
      heading: 100,
    },
    answer: { lat: 25.1972, lng: 55.2744 },
    hints: ["Middle East, on the Persian Gulf", "Dubai, UAE"],
  },
];
