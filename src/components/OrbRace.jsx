import { useState, useEffect } from "react";

const MAX_POINTS = 5000;

// A two-lane race: the You (gold) and AI (cyan) orbs glide from the start toward
// a finish line, each traveling a fraction of the track equal to its round
// points / MAX_POINTS. Pure presentation driven by scores already computed in
// gameState — no networking, no game-logic change.
// Implements prd.md > Features and Behavior > Play five rounds against an AI (reveal).
function Lane({ label, variant, points, run }) {
  const pct = Math.max(0, Math.min(1, (points ?? 0) / MAX_POINTS));
  // Start at 0, then glide to the target once `run` flips on (next frame),
  // so the CSS transition fires each reveal.
  const left = run ? `${(pct * 92).toFixed(2)}%` : "0%";

  return (
    <div className="race__lane">
      <div className="race__laneLabel">{label}</div>
      <div className="race__track">
        <div className={`race__runner race__runner--${variant}`} style={{ left }}>
          <span className="race__trail" aria-hidden="true"></span>
          <span className="race__orb" aria-hidden="true"></span>
        </div>
        <div className="race__finish" aria-hidden="true"></div>
      </div>
    </div>
  );
}

export default function OrbRace({ roundPoints, aiRoundPoints }) {
  const [run, setRun] = useState(false);

  // Kick off the glide on the next animation frame after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setRun(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="race" aria-label="Round race: you versus AI">
      <Lane label="You" variant="gold" points={roundPoints} run={run} />
      <Lane label="AI" variant="cyan" points={aiRoundPoints} run={run} />
    </div>
  );
}
