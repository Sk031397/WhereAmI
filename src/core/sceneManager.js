import * as THREE from 'three';

/**
 * SceneManager — owns the set of stadium scenes, tracks which is active,
 * swaps between them, and places the camera at a scene's spawn point.
 *
 * Scenes are provided as factory functions so a scene is only built when
 * first needed, then cached. The journey controller (slice 3/4) calls
 * `activate(id)` to drop the player at the destination on arrival.
 */
export class SceneManager {
  constructor(renderer) {
    this.renderer = renderer;
    this._factories = new Map();
    this._cache = new Map();
    this.current = null;
    this.onActivate = null;
  }

  /** Register a stadium by id with a factory that builds its scene bundle. */
  register(id, factory) {
    this._factories.set(id, factory);
  }

  _get(id) {
    if (!this._cache.has(id)) {
      const factory = this._factories.get(id);
      if (!factory) throw new Error(`No scene registered for "${id}"`);
      this._cache.set(id, factory());
    }
    return this._cache.get(id);
  }

  /** Make a stadium active, place the camera at its spawn, return the bundle. */
  activate(id) {
    const bundle = this._get(id);
    this.current = bundle;
    this.renderer.setActiveScene(bundle.scene);
    this.placeAtSpawn();
    this.onActivate?.(bundle);
    return bundle;
  }

  placeAtSpawn() {
    if (!this.current) return;
    const { position, lookAt } = this.current.spawn;
    const cam = this.renderer.camera;
    cam.position.copy(position);
    cam.lookAt(lookAt ?? new THREE.Vector3(0, position.y, 0));
  }

  /** Ids of all registered stadiums (used to resolve the "other" ground). */
  ids() {
    return [...this._factories.keys()];
  }
}
