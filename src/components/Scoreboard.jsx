import { ROUNDS } from "../lib/gameState.js";

// The bold scoreboard overlay — punchy result reveal in cinematic-luxury style.
// Shows the player vs the simulated AI opponent.
// Implements spec.md > Components > Scoreboard and
// prd.md > Features and Behavior > Play five rounds against an AI.
export default function Scoreboard({
  phase,
  round,
  distanceKm,
  roundPoints,
  totalScore,
  aiRoundPoints,
  aiTotalScore,
}) {
  if (phase === "finished") return null; // FinalTally takes over

  const revealed = phase === "revealed" && distanceKm != null;

  const distanceText =
    distanceKm == null
      ? ""
      : distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${Math.round(distanceKm).toLocaleString()} km`;

  return (
    <div className="scoreboard" role="status" aria-live="polite">
      <div className="scoreboard__round">
        Round {round} of {ROUNDS}
      </div>

      {revealed && (
        <div className="scoreboard__reveal">
          <div className="scoreboard__side">
            <div className="scoreboard__side-label">You</div>
            <div className="scoreboard__points">+{roundPoints.toLocaleString()}</div>
            <div className="scoreboard__distance-sub">{distanceText} off</div>
          </div>
          <div className="scoreboard__vs">vs</div>
          <div className="scoreboard__side">
            <div className="scoreboard__side-label">AI</div>
            <div className="scoreboard__points scoreboard__points--ai">
              +{(aiRoundPoints ?? 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <div className="scoreboard__total">
        You {totalScore.toLocaleString()} &nbsp;·&nbsp; AI {aiTotalScore.toLocaleString()}
      </div>
    </div>
  );
}
