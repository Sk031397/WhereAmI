import * as THREE from 'three';
import { buildStadium } from './stadiumBuilder.js';

/**
 * Stamford Bridge — the blue London ground.
 * Builds a THREE.Scene with sky, ground plane, the stylized stadium, and
 * defines the spawn point (outside the south entrance, facing in).
 *
 * Colours *suggest* Chelsea blue without using exact brand colours
 * (spec.md > Look and Feel).
 */
export function createStamfordBridge() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1430); // deep night-blue sky
  scene.fog = new THREE.Fog(0x0b1430, 60, 220);

  // Ambient + hemisphere so the stylized world reads even outside the spots.
  scene.add(new THREE.HemisphereLight(0x9fb8ff, 0x20304f, 0.6));
  const ambient = new THREE.AmbientLight(0x6677aa, 0.35);
  scene.add(ambient);

  // Ground plaza the stadium sits on.
  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(90, 48),
    new THREE.MeshStandardMaterial({ color: 0x1a2748, roughness: 1 })
  );
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = -0.01;
  plaza.receiveShadow = true;
  scene.add(plaza);

  const stadium = buildStadium({
    primary: '#1f6fe0',
    deep: '#0b3b8c',
    accent: '#7fb0ff',
  });
  scene.add(stadium);

  return {
    id: 'stamford-bridge',
    name: 'Stamford Bridge',
    colorTheme: 'blue',
    scene,
    // Spawn outside the south entrance, looking north toward the pitch.
    spawn: {
      position: new THREE.Vector3(0, 1.7, 48),
      lookAt: new THREE.Vector3(0, 1.7, 0),
    },
  };
}
