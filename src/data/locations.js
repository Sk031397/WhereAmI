// Hand-picked set of recognizable real locations.
// See spec.md > Data Model. `name` is internal (NOT shown to the player until
// the reveal). `camera` is where the Google 3D view starts; `answer` is the
// true location for scoring. `hints` are two escalating clues (vague → specific)
// surfaced by the point-costing Hint button.
//
// CAMERA TUNING: each view is framed to open on the landmark's most recognizable
// "postcard" angle — a close-ish range so the structure fills the frame, a tilt
// around 60-70° so you're looking AT the landmark (not straight down), and a
// heading chosen to face its iconic side. range/altitude are in meters.
// These are tuned from each landmark's best-known viewpoint; spot-check in the
// browser and nudge range/heading/tilt per location if any view feels off.
export const locations = [
  {
    name: "Eiffel Tower, Paris",
    camera: {
      center: { lat: 48.8584, lng: 2.2945, altitude: 150 },
      range: 650,
      tilt: 68,
      heading: 300, // look toward the tower from the Champ de Mars side
    },
    answer: { lat: 48.8584, lng: 2.2945 },
    hints: ["Western Europe", "France"],
  },
  {
    name: "Colosseum, Rome",
    camera: {
      center: { lat: 41.8902, lng: 12.4922, altitude: 90 },
      range: 520,
      tilt: 64,
      heading: 230, // face the iconic outer façade
    },
    answer: { lat: 41.8902, lng: 12.4922 },
    hints: ["Southern Europe, on a peninsula", "Italy"],
  },
  {
    name: "Statue of Liberty, New York",
    camera: {
      center: { lat: 40.6892, lng: -74.0445, altitude: 100 },
      range: 480,
      tilt: 62,
      heading: 210, // face the statue front, Manhattan behind
    },
    answer: { lat: 40.6892, lng: -74.0445 },
    hints: ["Eastern coast of North America", "New York City, USA"],
  },
  {
    name: "Sydney Opera House",
    camera: {
      center: { lat: -33.8568, lng: 151.2153, altitude: 90 },
      range: 560,
      tilt: 62,
      heading: 320, // face the shells across the harbour
    },
    answer: { lat: -33.8568, lng: 151.2153 },
    hints: ["Southern Hemisphere, by the coast", "Sydney, Australia"],
  },
  {
    name: "Burj Khalifa, Dubai",
    camera: {
      center: { lat: 25.1972, lng: 55.2744, altitude: 300 },
      range: 900,
      tilt: 58,
      heading: 230, // look up the length of the tower
    },
    answer: { lat: 25.1972, lng: 55.2744 },
    hints: ["Middle East, on the Persian Gulf", "Dubai, UAE"],
  },
];
