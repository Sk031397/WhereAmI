import * as THREE from 'three';
import { buildStadium } from './stadiumBuilder.js';
import { buildZoneMarker } from '../zones/zoneMarker.js';
import { STADIUMS } from '../data/stadiums.js';

/**
 * Stamford Bridge — the blue London ground.
 * Builds a THREE.Scene with sky, plaza, the stylized stadium, and glowing
 * markers for its geofence zones. Colours *suggest* Chelsea blue without
 * exact brand colours (spec.md > Look and Feel).
 */
const ACCENT = '#7fb0ff';

export function createStamfordBridge() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1430); // deep night-blue sky
  scene.fog = new THREE.Fog(0x0b1430, 60, 220);

  scene.add(new THREE.HemisphereLight(0x9fb8ff, 0x20304f, 0.6));
  scene.add(new THREE.AmbientLight(0x6677aa, 0.35));

  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(90, 48),
    new THREE.MeshStandardMaterial({ color: 0x1a2748, roughness: 1 })
  );
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = -0.01;
  plaza.receiveShadow = true;
  scene.add(plaza);

  scene.add(buildStadium({ primary: '#1f6fe0', deep: '#0b3b8c', accent: ACCENT }));

  // Glowing floor markers for each geofence zone.
  const def = STADIUMS['stamford-bridge'];
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
