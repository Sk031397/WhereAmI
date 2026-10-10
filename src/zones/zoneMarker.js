import * as THREE from 'three';

/**
 * Builds a subtle glowing floor marker for a geofence zone so the player
 * can see where to walk. Returns a THREE.Group placed at the zone's
 * ground position. Purely cosmetic — the actual trigger is the AABB check
 * in the zone system.
 */
export function buildZoneMarker(zone, accentColor) {
  const group = new THREE.Group();
  const { center, size } = zone.box;

  const color = new THREE.Color(accentColor);

  // Glowing ring on the floor.
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(Math.min(size.x, size.z) * 0.3, Math.min(size.x, size.z) * 0.42, 40),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(center.x, 0.05, center.z);
  group.add(ring);

  // Soft upward beam so it reads from a distance.
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(Math.min(size.x, size.z) * 0.3, Math.min(size.x, size.z) * 0.36, 3, 20, 1, true),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  beam.position.set(center.x, 1.5, center.z);
  group.add(beam);

  // Gentle pulse via userData the scene can animate if desired.
  group.userData.pulse = (t) => {
    const s = 1 + Math.sin(t * 2) * 0.06;
    ring.scale.set(s, s, s);
  };

  return group;
}
