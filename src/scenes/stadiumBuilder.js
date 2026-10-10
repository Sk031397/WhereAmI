import * as THREE from 'three';

/**
 * Builds a stylized, low-poly football ground as a THREE.Group:
 * a grass pitch, an oval ring of raked stands (the bowl), a set of
 * floodlight pylons, and a gap in one stand that acts as the walk-in
 * entrance. Recognizable as "a stadium", deliberately NOT a replica.
 *
 * Everything is driven by a colorTheme so Stamford Bridge (blue) and the
 * Emirates (red) share one builder — see spec.md > Look and Feel.
 */
export function buildStadium(theme) {
  const group = new THREE.Group();

  const primary = new THREE.Color(theme.primary);
  const deep = new THREE.Color(theme.deep);
  const accent = new THREE.Color(theme.accent ?? '#ffffff');

  // --- Pitch -------------------------------------------------------------
  const pitch = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 26),
    new THREE.MeshStandardMaterial({ color: 0x2f8f3a, roughness: 0.95 })
  );
  pitch.rotation.x = -Math.PI / 2;
  pitch.receiveShadow = true;
  group.add(pitch);

  // Centre circle + halfway line (thin flat decals)
  const line = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const centre = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.9, 48), line);
  centre.rotation.x = -Math.PI / 2;
  centre.position.y = 0.02;
  group.add(centre);
  const halfway = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 26), line);
  halfway.rotation.x = -Math.PI / 2;
  halfway.position.y = 0.02;
  group.add(halfway);

  // --- The bowl: four raked stands around the pitch ----------------------
  // Each stand is a tilted box of "seats". One stand (south) has a gap for
  // the entrance tunnel so the player can walk in.
  const standMat = new THREE.MeshStandardMaterial({ color: primary, roughness: 0.8 });
  const standMatDeep = new THREE.MeshStandardMaterial({ color: deep, roughness: 0.85 });
  const tierHeight = 7;
  const tierDepth = 9;

  function makeStand({ width, mat, gap = false }) {
    const stand = new THREE.Group();
    if (!gap) {
      const seats = new THREE.Mesh(
        new THREE.BoxGeometry(width, tierHeight, tierDepth),
        mat
      );
      seats.castShadow = true;
      seats.receiveShadow = true;
      stand.add(seats);
    } else {
      // Two segments leaving a central doorway gap.
      const seg = (width - 7) / 2;
      for (const sx of [-(seg / 2 + 3.5), seg / 2 + 3.5]) {
        const s = new THREE.Mesh(new THREE.BoxGeometry(seg, tierHeight, tierDepth), mat);
        s.position.x = sx;
        s.castShadow = true;
        s.receiveShadow = true;
        stand.add(s);
      }
      // A lintel over the entrance so there's a clear "tunnel".
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(7, 2, tierDepth), standMatDeep);
      lintel.position.y = tierHeight / 2 - 1;
      stand.add(lintel);
    }
    // Tilt the stand so it rakes up and outward (arcade look).
    stand.rotation.x = THREE.MathUtils.degToRad(-18);
    return stand;
  }

  const halfLen = 20;
  const halfWid = 13;
  const standOut = tierDepth / 2 + 0.5;

  // North stand (far side, +z deep tier)
  const north = makeStand({ width: halfLen * 2 + 4, mat: standMatDeep });
  north.position.set(0, tierHeight / 2 - 1, -(halfWid + standOut));
  group.add(north);

  // South stand (near side) — has the entrance gap
  const south = makeStand({ width: halfLen * 2 + 4, mat: standMat, gap: true });
  south.position.set(0, tierHeight / 2 - 1, halfWid + standOut);
  south.rotation.y = Math.PI;
  group.add(south);

  // East stand
  const east = makeStand({ width: halfWid * 2 + 4, mat: standMat });
  east.position.set(halfLen + standOut, tierHeight / 2 - 1, 0);
  east.rotation.y = -Math.PI / 2;
  group.add(east);

  // West stand
  const west = makeStand({ width: halfWid * 2 + 4, mat: standMat });
  west.position.set(-(halfLen + standOut), tierHeight / 2 - 1, 0);
  west.rotation.y = Math.PI / 2;
  group.add(west);

  // --- Floodlight pylons at the four corners -----------------------------
  const pylonMat = new THREE.MeshStandardMaterial({ color: 0x8893a7, roughness: 0.6, metalness: 0.3 });
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xfff6cc,
    emissive: 0xfff2b0,
    emissiveIntensity: 1.4,
  });
  for (const [cx, cz] of [
    [halfLen + 6, halfWid + 6],
    [halfLen + 6, -(halfWid + 6)],
    [-(halfLen + 6), halfWid + 6],
    [-(halfLen + 6), -(halfWid + 6)],
  ]) {
    const pylon = new THREE.Group();
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 24, 10), pylonMat);
    mast.position.y = 12;
    mast.castShadow = true;
    pylon.add(mast);
    const bank = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 0.8), lampMat);
    bank.position.set(0, 24, 0);
    pylon.add(bank);
    // Each pylon lights the pitch (the "full-capacity, lit" look).
    const spot = new THREE.SpotLight(0xfff4d6, 2.2, 120, Math.PI / 5, 0.5, 1.2);
    spot.position.set(cx, 24, cz);
    spot.target.position.set(0, 0, 0);
    pylon.position.set(cx, 0, cz);
    group.add(pylon);
    group.add(spot);
    group.add(spot.target);
  }

  // --- Accent ring banner around the top of the bowl ---------------------
  const banner = new THREE.Mesh(
    new THREE.TorusGeometry(halfLen + 4, 0.6, 8, 48),
    new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.25 })
  );
  banner.scale.set(1, 1, (halfWid + 4) / (halfLen + 4));
  banner.rotation.x = Math.PI / 2;
  banner.position.y = tierHeight + 2;
  group.add(banner);

  return group;
}
