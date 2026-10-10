import * as THREE from 'three';

/**
 * World / Renderer.
 * Owns the Three.js WebGLRenderer, the camera, and the per-frame render loop.
 * The loop fans out to any number of registered update callbacks (controls,
 * zone checks, journey animation), each called with the frame delta.
 *
 * WebXR is enabled on the renderer so the scene is headset-ready later; for
 * this POC it is driven by mouse + keyboard on desktop.
 */
export class Renderer {
  constructor(mountEl) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.xr.enabled = true; // headset-ready; desktop for the POC
    mountEl.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    this._updaters = new Set();
    this._lastTime = performance.now() / 1000;
    this._startTime = this._lastTime;
    this.activeScene = null;

    window.addEventListener('resize', () => this._onResize());
  }

  get domElement() {
    return this.renderer.domElement;
  }

  setActiveScene(scene) {
    this.activeScene = scene;
  }

  /** Register a function called every frame with (delta, elapsed). */
  addUpdater(fn) {
    this._updaters.add(fn);
    return () => this._updaters.delete(fn);
  }

  start() {
    this.renderer.setAnimationLoop(() => this._frame());
  }

  _frame() {
    const now = performance.now() / 1000;
    // Clamp delta so a backgrounded tab doesn't jump the camera on return.
    const delta = Math.min(now - this._lastTime, 0.1);
    const elapsed = now - this._startTime;
    this._lastTime = now;
    for (const fn of this._updaters) fn(delta, elapsed);
    if (this.activeScene) {
      this.renderer.render(this.activeScene, this.camera);
    }
  }

  _onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

/** True if the browser can create a WebGL context. */
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch (e) {
    return false;
  }
}
