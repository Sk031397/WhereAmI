import * as THREE from 'three';
import { createLondonScene } from './londonScene.js';
import { JOURNEY_SPLINE, JOURNEY_DURATION } from '../data/mapConfig.js';

/**
 * Journey Controller — THE KERNEL (scope.md > The Unique Kernel).
 * On Bus selection it: disables first-person controls, swaps the active
 * scene to a low-poly "London", flies the camera along a CatmullRomCurve3
 * for ~30s with a sweeping look-ahead, plays a matchday soundscape (started
 * on the user's click so autoplay isn't blocked), shows a Skip control, and
 * on finish/skip hands off to the SceneManager to drop the player outside
 * the destination ground.
 */
export class JourneyController {
  constructor(renderer, sceneManager, controls, overlayRoot) {
    this.renderer = renderer;
    this.sceneManager = sceneManager;
    this.controls = controls;
    this.playing = false;

    this.curve = new THREE.CatmullRomCurve3(JOURNEY_SPLINE, false, 'catmullrom', 0.5);
    this.duration = JOURNEY_DURATION;

    this._londonScene = null;
    this._t = 0;
    this._destId = null;
    this._lookAhead = new THREE.Vector3();
    this._pos = new THREE.Vector3();
    this._unsub = null;

    // Matchday soundscape (optional asset — never blocks the animation).
    this.audio = new Audio('/audio/matchday-soundscape.mp3');
    this.audio.loop = true;
    this.audio.volume = 0.6;

    this._buildSkipButton(overlayRoot);
  }

  _buildSkipButton(overlayRoot) {
    this.skipBtn = document.createElement('button');
    this.skipBtn.id = 'journey-skip';
    this.skipBtn.textContent = 'Skip \u00BB';
    Object.assign(this.skipBtn.style, {
      position: 'fixed',
      bottom: '7%',
      right: '6%',
      padding: '0.6rem 1.4rem',
      display: 'none',
      background: 'rgba(10,16,32,0.7)',
      color: '#f6f8ff',
      border: '1px solid rgba(255,255,255,0.4)',
      borderRadius: '999px',
      font: "700 1rem 'Trebuchet MS','Segoe UI',sans-serif",
      letterSpacing: '0.05em',
      cursor: 'pointer',
      pointerEvents: 'auto',
      zIndex: '16',
    });
    this.skipBtn.addEventListener('click', () => this._finish());
    overlayRoot.appendChild(this.skipBtn);
  }

  /**
   * Start the journey to `destId`. Called from the map on Bus selection —
   * i.e. inside a user gesture, so audio playback is permitted.
   */
  start(destId) {
    if (this.playing) return;
    this.playing = true;
    this._destId = destId;
    this._t = 0;

    this.controls.disable();

    this._londonScene = createLondonScene();
    this.renderer.setActiveScene(this._londonScene);

    // Try to play sound; ignore autoplay/asset errors (spec failure mode).
    this.audio.currentTime = 0;
    this.audio.play().catch(() => {});

    this.skipBtn.style.display = 'block';

    // Drive the camera each frame until done.
    this._unsub = this.renderer.addUpdater((delta) => this._tick(delta));
  }

  _tick(delta) {
    if (!this.playing) return;
    this._t += delta / this.duration;
    if (this._t >= 1) {
      this._finish();
      return;
    }
    // Position along the curve, looking slightly ahead for a cinematic sweep.
    this.curve.getPointAt(this._t, this._pos);
    this.curve.getPointAt(Math.min(this._t + 0.04, 1), this._lookAhead);
    const cam = this.renderer.camera;
    cam.position.copy(this._pos);
    cam.lookAt(this._lookAhead);
  }

  _finish() {
    if (!this.playing) return;
    this.playing = false;
    this.skipBtn.style.display = 'none';

    // Fade/stop the soundscape.
    try { this.audio.pause(); } catch (e) { /* no-op */ }

    if (this._unsub) { this._unsub(); this._unsub = null; }
    this._londonScene = null; // let GC reclaim the city

    // Hand off: drop the player outside the destination ground.
    this.controls.enable();
    this.sceneManager.activate(this._destId);
  }
}
