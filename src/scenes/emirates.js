import * as THREE from 'three';
import { buildStadium } from './stadiumBuilder.js';
import { buildZoneMarker } from '../zones/zoneMarker.js';
import { STADIUMS } from '../data/stadiums.js';

/**
 * Emirates — the red North London ground.
 * Same stylized builder as Stamford Bridge, re-themed red, with its own
 * geofence zones + rivalry cards. Colours *suggest* Arsenal red without
 * exact brand colours (spec.md > Look and Feel).
 */
const ACCENT = '#ff8a7a';

export function createEmirates() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a0d10); // deep warm red-night sky
  scene.fog = new THREE.Fog(0x2a0d10, 60, 220);

  scene.add(new THREE.HemisphereLight(0xffc9bf, 0x3a1f1c, 0.6));
  scene.add(new THREE.AmbientLight(0xaa6655, 0.35));

  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(90, 48),
    new THREE.MeshStandardMaterial({ color: 0x3a1518, roughness: 1 })
  );
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = -0.01;
  plaza.receiveShadow = true;
  scene.add(plaza);

  scene.add(buildStadium({ primary: '#e8402a', deep: '#9c1409', accent: ACCENT }));

  const def = STADIUMS.emirates;
  const pulses = [];
  for (const zone of def.zones) {
    const marker = buildZoneMarker(zone, ACCENT);
    scene.add(marker);
    if (marker.userData.pulse) pulses.push(marker.userData.pulse);
  }

  return {
    id: def.id,
    name: def.name,
    colorTheme: def.colorTheme,
    accent: ACCENT,
    zones: def.zones,
    cards: def.cards,
    scene,
    update: (delta, elapsed) => pulses.forEach((p) => p(elapsed)),
    spawn: {
      position: new THREE.Vector3(0, 1.7, 48),
      lookAt: new THREE.Vector3(0, 1.7, 0),
    },
  };
}
