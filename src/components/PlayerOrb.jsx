// A glowing neon orb avatar with a comet-trail and a name label — the identity
// marker for a competitor (You / AI). Pure CSS; style lives in app.css.
// Inspired by the neon-orb multiplayer thumbnail the learner referenced.
// variant: "gold" (You) | "cyan" (AI). size: "sm" | "md".
export default function PlayerOrb({ name, variant = "gold", size = "md", points }) {
  return (
    <div className={`orb orb--${variant} orb--${size}`}>
      <div className="orb__trail" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="orb__ball" aria-hidden="true"></div>
      <div className="orb__label">{name}</div>
      {points != null && <div className="orb__points">{points.toLocaleString()}</div>}
    </div>
  );
}
