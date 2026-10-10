import { Renderer, isWebGLAvailable } from './core/renderer.js';
import { SceneManager } from './core/sceneManager.js';
import { FirstPersonControls } from './controls/firstPerson.js';
import { Tutorial } from './controls/tutorial.js';
import { ZoneSystem } from './zones/zoneSystem.js';
import { CardOverlay } from './ui/card.js';
import { LogOverlay } from './ui/log.js';
import { createStamfordBridge } from './scenes/stamfordBridge.js';
import { STADIUMS } from './data/stadiums.js';

/**
 * Matchday Hop — entry point.
 * Slice 1: renderer + first-person controls + tutorial at Stamford Bridge.
 * Slice 2: geofence zones -> non-blocking rivalry cards -> J log (persisted).
 * Later slices add the map + journey (3) and the Emirates (4).
 */
function boot() {
  const appEl = document.getElementById('app');
  const overlayRoot = document.getElementById('overlay-root');
  const lockPrompt = document.getElementById('lock-prompt');
  const fatal = document.getElementById('fatal');

  if (!isWebGLAvailable()) {
    fatal.classList.add('show');
    return;
  }

  const renderer = new Renderer(appEl);

  const scenes = new SceneManager(renderer);
  scenes.register('stamford-bridge', createStamfordBridge);

  const controls = new FirstPersonControls(renderer.camera, renderer.domElement);
  const tutorial = new Tutorial(overlayRoot);

  controls.onLockChange = (locked) => {
    lockPrompt.classList.toggle('hidden', locked);
    if (locked) tutorial.begin();
  };
  controls.onFirstLook = () => tutorial.onLook();
  controls.onFirstMove = () => tutorial.onMove();

  // --- Zones + cards ----------------------------------------------------
  const zoneSystem = new ZoneSystem(renderer.camera);
  const card = new CardOverlay(overlayRoot);

  // Flat id -> card lookup across all grounds, for the log.
  const allCards = Object.assign(
    {},
    ...Object.values(STADIUMS).map((s) => s.cards)
  );
  const log = new LogOverlay(overlayRoot, allCards);

  // On zone entry, pop that zone's card (which also records it to the log).
  zoneSystem.onEnter = (zone) => {
    const current = scenes.current;
    const cardData = current?.cards?.[zone.cardId];
    if (cardData) card.show(zone.label, cardData);
  };

  // When a scene becomes active, point the zone system + card accent at it.
  scenes.onActivate = (bundle) => {
    zoneSystem.setZones(bundle.zones ?? []);
    if (bundle.accent) card.setAccent(bundle.accent);
  };

  // --- Per-frame updates ------------------------------------------------
  renderer.addUpdater((delta, elapsed) => {
    controls.update(delta);
    zoneSystem.update();
    scenes.current?.update?.(delta, elapsed);
  });

  // --- Keybinds ---------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyJ') {
      log.toggle();
    } else if (e.code === 'Escape' && log.open) {
      log.hide();
    }
  });

  scenes.activate('stamford-bridge');
  renderer.start();

  window.__matchday = { renderer, scenes, controls, zoneSystem, log };
}

boot();
