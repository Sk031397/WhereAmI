import { ROUNDS } from "../lib/gameState.js";

// Final tally screen shown after the last round.
// Implements prd.md > Features and Behavior > Play five rounds, then see a final tally.
export default function FinalTally({ totalScore, onPlayAgain }) {
  const maxPossible = 5000 * ROUNDS;

  return (
    <div className="tally" role="dialog" aria-label="Final score">
      <div className="tally__card">
        <div className="tally__label">Game over</div>
        <div className="tally__score">{totalScore.toLocaleString()}</div>
        <div className="tally__label">
          out of {maxPossible.toLocaleString()} across {ROUNDS} rounds
        </div>
        <button className="tally__button" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    </div>
  );
}
