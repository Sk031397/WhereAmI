import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

/**
 * First-person controls.
 * Mouse-look via PointerLockControls (imported from three/addons in
 * three@0.186), WASD / arrow-key movement on the ground plane. Movement is
 * camera-relative but kept horizontal so you walk rather than fly.
 *
 * Exposes `onLockChange` so the UI can show/hide the "Click to look around"
 * prompt (spec.md > Important Failure Modes: pointer lock not engaged).
 */
export class FirstPersonControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.controls = new PointerLockControls(camera, domElement);
    this.speed = 14; // units per second
    this.enabled = true;
    this.inputBlocked = false; // true while a blocking overlay is open
    this.locked = false;
    this.onLockChange = null;

    this._keys = new Set();
    this._forward = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._move = new THREE.Vector3();

    // Movement intent — emitted so the tutorial can advance.
    this.onFirstMove = null;
    this.onFirstLook = null;
    this._movedOnce = false;
    this._lookedOnce = false;

    this.controls.addEventListener('lock', () => {
      this.locked = true;
      this.onLockChange?.(true);
    });
    this.controls.addEventListener('unlock', () => {
      this.locked = false;
      this.onLockChange?.(false);
    });
    this.controls.addEventListener('change', () => {
      if (!this._lookedOnce && this.locked) {
        this._lookedOnce = true;
        this.onFirstLook?.();
      }
    });

    // Click the canvas to capture the mouse.
    domElement.addEventListener('click', () => {
      if (this.enabled && !this.locked) this.controls.lock();
    });

    window.addEventListener('keydown', (e) => this._keys.add(e.code));
    window.addEventListener('keyup', (e) => this._keys.delete(e.code));
  }

  get object() {
    return this.controls.object ?? this.camera;
  }

  update(delta) {
    // Movement works whenever controls are enabled — it does NOT require
    // pointer lock. Only mouse-look needs lock. This avoids the dead-input
    // trap where losing lock (Esc, clicking a button) silently kills WASD.
    if (!this.enabled) return;
    if (this.inputBlocked) return;

    const f = (this._keys.has('KeyW') || this._keys.has('ArrowUp')) ? 1 : 0;
    const b = (this._keys.has('KeyS') || this._keys.has('ArrowDown')) ? 1 : 0;
    const l = (this._keys.has('KeyA') || this._keys.has('ArrowLeft')) ? 1 : 0;
    const r = (this._keys.has('KeyD') || this._keys.has('ArrowRight')) ? 1 : 0;

    const fwd = f - b;
    const strafe = r - l;
    if (fwd === 0 && strafe === 0) return;

    // Camera-relative, flattened to the ground plane.
    this.camera.getWorldDirection(this._forward);
    this._forward.y = 0;
    this._forward.normalize();
    this._right.crossVectors(this._forward, this.camera.up).normalize();

    this._move.set(0, 0, 0);
    this._move.addScaledVector(this._forward, fwd);
    this._move.addScaledVector(this._right, strafe);
    if (this._move.lengthSq() > 0) {
      this._move.normalize().multiplyScalar(this.speed * delta);
      this.camera.position.add(this._move);
      this.camera.position.y = 1.7; // stay at eye height

      if (!this._movedOnce) {
        this._movedOnce = true;
        this.onFirstMove?.();
      }
    }
  }

  /** Disable movement + release the mouse (used during the journey). */
  disable() {
    this.enabled = false;
    if (this.locked) this.controls.unlock();
  }

  enable() {
    this.enabled = true;
  }
}
