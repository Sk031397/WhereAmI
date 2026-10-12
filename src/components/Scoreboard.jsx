import { ROUNDS } from "../lib/gameState.js";

// The bold scoreboard overlay — punchy result reveal in cinematic-luxury style.
// Implements spec.md > Components > Scoreboard and
// prd.md > Features and Behavior > See how close you were + Play five rounds.
export default function Scoreboard({ phase, round, distanceKm, roundPoints, totalScore }) {
  // Hidden on the final tally screen (FinalTally takes over).
  if (phase === "finished") return null;

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
        <>
          <div className="scoreboard__points">
            +{roundPoints.toLocaleString()} pts
          </div>
          <div className="scoreboard__distance-sub">{distanceText} off</div>
        </>
      )}

      <div className="scoreboard__total">
        Total {totalScore.toLocaleString()}
      </div>
    </div>
  );
}
