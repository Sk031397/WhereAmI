// The bold scoreboard overlay — punchy result reveal in cinematic-luxury style.
// Implements spec.md > Components > Scoreboard and
// prd.md > Features and Behavior > See how close you were.
export default function Scoreboard({ phase, distanceKm }) {
  if (phase !== "revealed" || distanceKm == null) return null;

  const rounded =
    distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m`
      : `${Math.round(distanceKm).toLocaleString()} km`;

  return (
    <div className="scoreboard" role="status" aria-live="polite">
      <div className="scoreboard__label">You were</div>
      <div className="scoreboard__distance">{rounded}</div>
      <div className="scoreboard__label">off</div>
    </div>
  );
}
