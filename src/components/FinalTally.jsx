import { ROUNDS } from "../lib/gameState.js";

// Final tally screen: player vs AI totals and the winner.
// Implements prd.md > Features and Behavior > Play five rounds against an AI.
export default function FinalTally({ totalScore, aiTotalScore, winner, onPlayAgain }) {
  const headline =
    winner === "you" ? "You win!" : winner === "ai" ? "AI wins" : "It's a tie";

  return (
    <div className="tally" role="dialog" aria-label="Final score">
      <div className="tally__card">
        <div className="tally__label">Game over · {ROUNDS} rounds</div>
        <div className={`tally__headline tally__headline--${winner}`}>{headline}</div>

        <div className="tally__scores">
          <div className="tally__scoreside">
            <div className="tally__label">You</div>
            <div className="tally__score">{totalScore.toLocaleString()}</div>
          </div>
          <div className="tally__scoreside">
            <div className="tally__label">AI</div>
            <div className="tally__score tally__score--ai">
              {aiTotalScore.toLocaleString()}
            </div>
          </div>
        </div>

        <button className="tally__button" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    </div>
  );
}
