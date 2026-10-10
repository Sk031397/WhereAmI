import * as THREE from 'three';

/**
 * Low-poly abstract "London" the journey camera flies over. Deliberately
 * stylized (not geo-accurate tiles) per scope.md > Explicitly Cut: a grid
 * of simple building blocks, a winding river ribbon, and a couple of
 * landmark silhouettes, lit for a bright matchday-afternoon sweep.
 *
 * Returns a THREE.Scene used only during the journey, then discarded by the
 * controller when it hands back to a stadium.
 */
export function createLondonScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8fc2ff); // bright day sky
  scene.fog = new THREE.Fog(0x8fc2ff, 120, 420);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x5a6b55, 0.9));
  const sun = new THREE.DirectionalLight(0xfff2d0, 1.2);
  sun.position.set(60, 120, 40);
  scene.add(sun);

  // Ground.
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(900, 900),
    new THREE.MeshStandardMaterial({ color: 0x6f9f5a, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  scene.add(ground);

  // A field of stylized buildings along the flight corridor.
  const palette = [0xdfe6ef, 0xcad6e6, 0xe8d9c4, 0xd9c9b0, 0xbfc9d6];
  const rng = mulberry32(1337); // deterministic layout
  const buildings = new THREE.Group();
  for (let i = 0; i < 320; i++) {
    const x = (rng() - 0.5) * 480;
    const z = -rng() * 360 + 60;
    // Keep a clear channel for the river/flight line near x~0.
    if (Math.abs(x) < 12) continue;
    const w = 4 + rng() * 10;
    const d = 4 + rng() * 10;
    const h = 6 + rng() * 48;
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color: palette[(rng() * palette.length) | 0],
        roughness: 0.85,
        flatShading: true,
      })
    );
    mesh.position.set(x, h / 2, z);
    buildings.add(mesh);
  }
  scene.add(buildings);

  // A winding river ribbon snaking down the corridor.
  const riverShape = new THREE.Shape();
  riverShape.moveTo(-6, 0);
  riverShape.lineTo(6, 0);
  const riverPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-30, 0.1, 80),
    new THREE.Vector3(10, 0.1, 10),
    new THREE.Vector3(-15, 0.1, -80),
    new THREE.Vector3(20, 0.1, -170),
    new THREE.Vector3(-10, 0.1, -260),
  ]);
  const river = new THREE.Mesh(
    new THREE.TubeGeometry(riverPath, 120, 7, 6, false),
    new THREE.MeshStandardMaterial({ color: 0x4a86c4, roughness: 0.3, metalness: 0.1 })
  );
  river.scale.y = 0.05;
  scene.add(river);

  // Two stylized landmark silhouettes for a sense of "a city".
  const wheel = new THREE.Mesh(
    new THREE.TorusGeometry(18, 1.2, 8, 32),
    new THREE.MeshStandardMaterial({ color: 0xeef2f7, flatShading: true })
  );
  wheel.position.set(-28, 18, -40);
  scene.add(wheel);

  const tower = new THREE.Mesh(
    new THREE.ConeGeometry(6, 60, 6),
    new THREE.MeshStandardMaterial({ color: 0xd8c38f, flatShading: true })
  );
  tower.position.set(40, 30, -150);
  scene.add(tower);

  return scene;
}

// Small deterministic PRNG so the city looks the same every run.
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
