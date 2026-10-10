import { Renderer, isWebGLAvailable } from './core/renderer.js';
import { SceneManager } from './core/sceneManager.js';
import { FirstPersonControls } from './controls/firstPerson.js';
import { Tutorial } from './controls/tutorial.js';
import { ZoneSystem } from './zones/zoneSystem.js';
import { CardOverlay } from './ui/card.js';
import { LogOverlay } from './ui/log.js';
import { MapOverlay } from './ui/map.js';
import { JourneyController } from './journey/journeyController.js';
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
  // Slice 3: the Emirates scene doesn't exist yet, so the Bus journey lands
  // back at Stamford Bridge. Slice 4 replaces this with the real red ground.
  scenes.register('emirates', createStamfordBridge);

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

  // --- Map + journey (the kernel) --------------------------------------
  const journey = new JourneyController(renderer, scenes, controls, overlayRoot);
  const map = new MapOverlay(overlayRoot, {
    getCurrentId: () => scenes.current?.id,
    onTravel: (destId, mode) => {
      if (mode === 'bus') journey.start(destId);
    },
  });

  // --- Per-frame updates ------------------------------------------------
  renderer.addUpdater((delta, elapsed) => {
    // Pause walking whenever a blocking overlay is open (always in sync,
    // however the overlay was opened or closed).
    controls.inputBlocked = log.open || map.open;
    controls.update(delta);
    zoneSystem.update();
    scenes.current?.update?.(delta, elapsed);
  });

  // --- Keybinds ---------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (journey.playing) return; // overlays locked out during the journey
    if (e.code === 'KeyJ') {
      if (map.open) return;
      log.toggle();
    } else if (e.code === 'KeyM') {
      if (log.open) return;
      map.toggle();
    } else if (e.code === 'Escape') {
      if (log.open) log.hide();
      if (map.open) map.hide();
    }
  });

  scenes.activate('stamford-bridge');
  renderer.start();

  window.__matchday = { renderer, scenes, controls, zoneSystem, log, map, journey };
}

boot();
