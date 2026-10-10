import { Renderer, isWebGLAvailable } from './core/renderer.js';
import { SceneManager } from './core/sceneManager.js';
import { FirstPersonControls } from './controls/firstPerson.js';
import { Tutorial } from './controls/tutorial.js';
import { createStamfordBridge } from './scenes/stamfordBridge.js';

/**
 * Matchday Hop — entry point.
 * Boots the renderer, registers the stadiums, places the player outside
 * Stamford Bridge, and starts the first-person loop with the contextual
 * tutorial. Later slices add zones/cards (2), the map + journey (3), and
 * the Emirates (4).
 */
function boot() {
  const appEl = document.getElementById('app');
  const overlayRoot = document.getElementById('overlay-root');
  const lockPrompt = document.getElementById('lock-prompt');
  const fatal = document.getElementById('fatal');

  // Fail gracefully with a readable message instead of a blank canvas.
  if (!isWebGLAvailable()) {
    fatal.classList.add('show');
    return;
  }

  const renderer = new Renderer(appEl);

  const scenes = new SceneManager(renderer);
  scenes.register('stamford-bridge', createStamfordBridge);

  const controls = new FirstPersonControls(renderer.camera, renderer.domElement);
  const tutorial = new Tutorial(overlayRoot);

  // Pointer-lock prompt: show "Click to look around" whenever not locked.
  controls.onLockChange = (locked) => {
    lockPrompt.classList.toggle('hidden', locked);
    if (locked) tutorial.begin();
  };
  controls.onFirstLook = () => tutorial.onLook();
  controls.onFirstMove = () => tutorial.onMove();

  // Drive controls each frame.
  renderer.addUpdater((delta) => controls.update(delta));

  // Start at Stamford Bridge, outside the entrance.
  scenes.activate('stamford-bridge');

  renderer.start();

  // Expose a tiny handle for debugging in the console.
  window.__matchday = { renderer, scenes, controls };
}

boot();
