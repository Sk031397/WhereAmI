import { ROUNDS } from "../lib/gameState.js";
import PlayerOrb from "./PlayerOrb.jsx";

// Final tally screen: player vs AI totals (as glowing orbs) and the winner.
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
          <PlayerOrb name="You" variant="gold" size="md" points={totalScore} />
          <div className="tally__vs">vs</div>
          <PlayerOrb name="AI" variant="cyan" size="md" points={aiTotalScore} />
        </div>

        <button className="tally__button" onClick={onPlayAgain}>
          Play again
        </button>
      </div>
    </div>
  );
}
