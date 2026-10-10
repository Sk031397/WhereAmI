import * as THREE from 'three';

/**
 * Static stadium definitions: per-ground geofence zones and the rivalry
 * card each zone pops. Zones are axis-aligned boxes in world space; the
 * zone system checks the camera against them each frame (spec.md > Data
 * Model). Card text is DRAFTED from established rivalry facts — the learner
 * refines wording later (prd.md > Product Decisions).
 *
 * Emirates is added in slice 4; its block is here as the second ground.
 */

export const STADIUMS = {
  'stamford-bridge': {
    id: 'stamford-bridge',
    name: 'Stamford Bridge',
    colorTheme: 'blue',
    zones: [
      {
        id: 'sb-plaza',
        label: 'The Forecourt',
        box: { center: new THREE.Vector3(0, 1.7, 36), size: new THREE.Vector3(10, 4, 8) },
        cardId: 'sb-west-london',
      },
      {
        id: 'sb-entrance',
        label: 'The Tunnel',
        box: { center: new THREE.Vector3(0, 1.7, 15), size: new THREE.Vector3(7, 4, 6) },
        cardId: 'sb-european-nights',
      },
      {
        id: 'sb-bowl',
        label: 'Pitchside',
        box: { center: new THREE.Vector3(0, 1.7, -4), size: new THREE.Vector3(14, 4, 10) },
        cardId: 'sb-trophies',
      },
    ],
    cards: {
      'sb-west-london': {
        id: 'sb-west-london',
        title: 'West London Blue',
        body: 'This is the blue half of the capital. The derby with the red North London side is a clash of two of England\u2019s biggest matchday atmospheres.',
      },
      'sb-european-nights': {
        id: 'sb-european-nights',
        title: 'European Nights',
        body: 'The blues are proud two-time champions of Europe \u2014 famous for grinding out the biggest trophy in club football under the lights.',
      },
      'sb-trophies': {
        id: 'sb-trophies',
        title: 'The Trophy Room',
        body: 'Decades of league titles, domestic cups, and European silverware fill the cabinet. The modern era has been one of the club\u2019s most decorated.',
      },
    },
  },

  emirates: {
    id: 'emirates',
    name: 'Emirates',
    colorTheme: 'red',
    zones: [
      {
        id: 'em-plaza',
        label: 'The Approach',
        box: { center: new THREE.Vector3(0, 1.7, 36), size: new THREE.Vector3(10, 4, 8) },
        cardId: 'em-north-london',
      },
      {
        id: 'em-entrance',
        label: 'The Concourse',
        box: { center: new THREE.Vector3(0, 1.7, 15), size: new THREE.Vector3(7, 4, 6) },
        cardId: 'em-champions',
      },
      {
        id: 'em-bowl',
        label: 'Pitchside',
        box: { center: new THREE.Vector3(0, 1.7, -4), size: new THREE.Vector3(14, 4, 10) },
        cardId: 'em-invincibles',
      },
    ],
    cards: {
      'em-north-london': {
        id: 'em-north-london',
        title: 'North London Red',
        body: 'The red side of the city. Away days here mean a loud, modern bowl and one of the fiercest rivalries in the English game.',
      },
      'em-champions': {
        id: 'em-champions',
        title: 'League Pedigree',
        body: 'A club with a long history at the top of English football \u2014 recent seasons have put them right back in the title race.',
      },
      'em-invincibles': {
        id: 'em-invincibles',
        title: 'The Unbeaten Season',
        body: 'Famous for going a full league campaign without a single defeat \u2014 a feat that still stands apart in the modern game.',
      },
    },
  },
};
