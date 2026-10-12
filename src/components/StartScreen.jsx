import { ROUNDS } from "../lib/gameState.js";

// Intro/start screen shown before round 1. Frames the task and controls —
// never names a location, so the recognition kernel is preserved.
// Implements prd.md > The Core Journey (step 1).
export default function StartScreen({ onStart }) {
  return (
    <div className="start" role="dialog" aria-label="How to play">
      <div className="start__card">
        <h1 className="start__title">Where Am I?</h1>
        <p className="start__tagline">Fly into a real place. Figure out where on Earth you are.</p>

        <ul className="start__points">
          <li>You're dropped into <strong>{ROUNDS} real locations</strong> in photorealistic 3D — no labels.</li>
          <li>Look around, then guess: <strong>drop a pin</strong> on the map or <strong>type the place</strong>.</li>
          <li>Closer guesses score more. <strong>Hints</strong> help but cost points.</li>
          <li>You're racing a rival <strong>AI</strong> — highest total after {ROUNDS} rounds wins.</li>
        </ul>

        <button className="start__button" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  );
}
