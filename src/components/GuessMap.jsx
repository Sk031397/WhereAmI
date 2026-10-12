import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { lerpLatLng } from "../lib/distance.js";

const MAX_POINTS = 5000;
const RACE_MS = 1600;

// Glowing dot markers that match the orb identities (pure CSS via DivIcon).
function dotIcon(colorClass, size = 18) {
  return L.divIcon({
    className: "",
    html: `<span class="mapdot mapdot--${colorClass}"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}
const pinIcon = dotIcon("pin"); // faint static guess pins
const playerIcon = dotIcon("gold");
const aiIcon = dotIcon("cyan");
const truthIcon = dotIcon("truth");

function ClickCapture({ onPick, locked }) {
  useMapEvents({
    click(e) {
      if (locked) return;
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// Drives the on-map race during a reveal: animates the gold (you) and cyan (ai)
// orbs from their guess pins toward the true location, each traveling a fraction
// of the way equal to its score. The map follow-pans the gold orb, then eases out
// to frame both guesses and the truth. Child of MapContainer so it has map access.
function MapRace({ guess, aiGuess, truth, roundPoints, aiRoundPoints }) {
  const map = useMap();
  const [playerPos, setPlayerPos] = useState(null);
  const [aiPos, setAiPos] = useState(null);

  useEffect(() => {
    // Only race when we have both guesses, the truth, and scores.
    if (!guess || !aiGuess || !truth) {
      setPlayerPos(null);
      setAiPos(null);
      return;
    }

    const playerFrac = Math.max(0, Math.min(1, (roundPoints ?? 0) / MAX_POINTS));
    const aiFrac = Math.max(0, Math.min(1, (aiRoundPoints ?? 0) / MAX_POINTS));

    let raf;
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / RACE_MS);
      // ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      const p = lerpLatLng(guess, truth, playerFrac * eased);
      const a = lerpLatLng(aiGuess, truth, aiFrac * eased);
      setPlayerPos(p);
      setAiPos(a);

      // Follow-cam: keep the gold orb in view as it travels.
      map.panTo([p.lat, p.lng], { animate: true, duration: 0.25 });

      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        // Ease out to frame both guesses and the truth together.
        const bounds = L.latLngBounds([
          [guess.lat, guess.lng],
          [aiGuess.lat, aiGuess.lng],
          [truth.lat, truth.lng],
        ]).pad(0.4);
        map.fitBounds(bounds, { animate: true });
      }
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [guess, aiGuess, truth, roundPoints, aiRoundPoints, map]);

  return (
    <>
      {playerPos && <Marker position={[playerPos.lat, playerPos.lng]} icon={playerIcon} />}
      {aiPos && <Marker position={[aiPos.lat, aiPos.lng]} icon={aiIcon} />}
    </>
  );
}

// The always-visible corner guess map.
// Implements spec.md > Components > GuessMap and
// prd.md > Features and Behavior > Drop a pin to guess + Play five rounds against an AI.
export default function GuessMap({
  guess,
  aiGuess,
  truth,
  roundPoints,
  aiRoundPoints,
  hintRegion,
  locked,
  onPick,
}) {
  const racing = !!(guess && aiGuess && truth);

  return (
    <div className="guessmap" aria-label="Guess map — click to drop your pin">
      <MapContainer
        center={[20, 0]}
        zoom={1}
        className="guessmap__map"
        worldCopyJump={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCapture onPick={onPick} locked={locked} />

        {/* Hint region: a translucent pulsing circle narrowing the search while
            exploring (broad → tighter per hint). Hidden once the result races. */}
        {!racing && hintRegion && (
          <Circle
            center={[hintRegion.center.lat, hintRegion.center.lng]}
            radius={hintRegion.radiusKm * 1000}
            pathOptions={{
              className: "hintcircle",
              color: "#e8c89a",
              fillColor: "#e8c89a",
              fillOpacity: 0.12,
              weight: 2,
            }}
          />
        )}

        {/* Static reference pins during a reveal: where each actually guessed. */}
        {racing && <Marker position={[guess.lat, guess.lng]} icon={pinIcon} />}
        {racing && <Marker position={[aiGuess.lat, aiGuess.lng]} icon={pinIcon} />}
        {/* Pre-reveal: show the player's locked guess pin in gold. */}
        {!racing && guess && <Marker position={[guess.lat, guess.lng]} icon={playerIcon} />}

        {truth && <Marker position={[truth.lat, truth.lng]} icon={truthIcon} />}

        {racing && (
          <MapRace
            guess={guess}
            aiGuess={aiGuess}
            truth={truth}
            roundPoints={roundPoints}
            aiRoundPoints={aiRoundPoints}
          />
        )}
      </MapContainer>
    </div>
  );
}
