import * as THREE from 'three';

/**
 * Zone system — the stylized "geofence".
 * Holds a set of axis-aligned bounding boxes (built from each zone's
 * center + size) and, every frame, checks whether the camera has entered a
 * box it was not inside last frame. On a fresh entry it fires `onEnter(zone)`.
 * Leaving and re-entering fires again (prd.md > Geofence info-zones:
 * re-entering a zone can pop its card again).
 */
export class ZoneSystem {
  constructor(camera) {
    this.camera = camera;
    this.zones = [];
    this.onEnter = null;
    this._inside = new Set(); // zone ids the camera is currently within
    this._point = new THREE.Vector3();
  }

  /** Replace the active zone set (called on each scene activation). */
  setZones(zoneDefs) {
    this.zones = zoneDefs.map((z) => ({
      def: z,
      aabb: new THREE.Box3().setFromCenterAndSize(z.box.center, z.box.size),
    }));
    this._inside.clear();
  }

  update() {
    if (!this.zones.length) return;
    this.camera.getWorldPosition(this._point);
    for (const { def, aabb } of this.zones) {
      const isInside = aabb.containsPoint(this._point);
      const wasInside = this._inside.has(def.id);
      if (isInside && !wasInside) {
        this._inside.add(def.id);
        this.onEnter?.(def);
      } else if (!isInside && wasInside) {
        this._inside.delete(def.id);
      }
    }
  }
}
