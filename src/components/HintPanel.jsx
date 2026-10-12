import { HINT_MULTIPLIERS, MAX_HINTS, hintMultiplier } from "../lib/gameState.js";

// Floating hint panel shown while exploring. Reveals escalating clues on demand;
// each hint lowers this round's score multiplier. The AI never uses hints.
// Implements prd.md > Features and Behavior > Take optional hints at a cost.
export default function HintPanel({ hints, hintsUsed, onHint }) {
  const atMax = hintsUsed >= MAX_HINTS;
  const nextMultiplier = HINT_MULTIPLIERS[Math.min(MAX_HINTS, hintsUsed + 1)];
  const currentPct = Math.round(hintMultiplier(hintsUsed) * 100);

  return (
    <div className="hints" aria-label="Hints">
      <div className="hints__header">
        <span className="hints__title">Hints</span>
        <span className="hints__score">Score this round: {currentPct}%</span>
      </div>

      <ol className="hints__list">
        {hints.slice(0, hintsUsed).map((h, i) => (
          <li key={i} className="hints__item">{h}</li>
        ))}
      </ol>

      <button
        className="hints__button"
        onClick={onHint}
        disabled={atMax}
      >
        {atMax
          ? "No more hints"
          : `Reveal hint (score → ${Math.round(nextMultiplier * 100)}%)`}
      </button>
    </div>
  );
}
