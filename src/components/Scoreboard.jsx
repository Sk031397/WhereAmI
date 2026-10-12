import { ROUNDS } from "../lib/gameState.js";
import PlayerOrb from "./PlayerOrb.jsx";

// The bold scoreboard overlay — objective prompt while exploring, punchy result
// reveal with You-vs-AI orbs on the result. Implements spec.md > Components >
// Scoreboard and prd.md > Features and Behavior.
export default function Scoreboard({
  phase,
  round,
  locationName,
  distanceKm,
  typedGuess,
  typedCorrect,
  roundPoints,
  totalScore,
  aiRoundPoints,
  aiTotalScore,
}) {
  if (phase === "finished") return null; // FinalTally takes over

  // Reveal is driven by the phase, NOT by distance (a wrong typed guess has no
  // distance but still reveals a result).
  const revealed = phase === "revealed";
  const exploring = phase === "exploring";

  const distanceText =
    distanceKm == null
      ? null
      : distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${Math.round(distanceKm).toLocaleString()} km`;

  return (
    <div className="scoreboard" role="status" aria-live="polite">
      <div className="scoreboard__round">
        Round {round} of {ROUNDS}
      </div>

      {exploring && (
        <div className="scoreboard__prompt">
          Where in the world are you? Fly around, then drop a pin or type the place.
        </div>
      )}

      {revealed && (
        <>
          <div className="scoreboard__answer">
            That was <strong>{locationName}</strong>
          </div>

          {typedGuess && (
            <div className="scoreboard__typed">
              You said “{typedGuess}” — {typedCorrect ? "correct!" : "not quite"}
            </div>
          )}

          <div className="scoreboard__reveal">
            <div className="scoreboard__side">
              <PlayerOrb name="You" variant="gold" size="sm" />
              <div className="scoreboard__points">+{(roundPoints ?? 0).toLocaleString()}</div>
              {distanceText && (
                <div className="scoreboard__distance-sub">{distanceText} off</div>
              )}
            </div>
            <div className="scoreboard__vs">vs</div>
            <div className="scoreboard__side">
              <PlayerOrb name="AI" variant="cyan" size="sm" />
              <div className="scoreboard__points scoreboard__points--ai">
                +{(aiRoundPoints ?? 0).toLocaleString()}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="scoreboard__total">
        You {totalScore.toLocaleString()} &nbsp;·&nbsp; AI {aiTotalScore.toLocaleString()}
      </div>
    </div>
  );
}
