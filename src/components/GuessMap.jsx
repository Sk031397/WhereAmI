import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Glowing dot markers that match the orb identities. Pure CSS via DivIcon,
// so no image assets are needed and the colors stay in sync with the orbs.
function dotIcon(colorClass) {
  return L.divIcon({
    className: "", // avoid Leaflet's default styling
    html: `<span class="mapdot mapdot--${colorClass}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

const playerIcon = dotIcon("gold"); // You
const aiIcon = dotIcon("cyan"); // AI opponent
const truthIcon = dotIcon("truth"); // true location

// Captures a single map click and reports it up, only while unlocked.
function ClickCapture({ onPick, locked }) {
  useMapEvents({
    click(e) {
      if (locked) return;
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// The always-visible corner guess map.
// Implements spec.md > Components > GuessMap and
// prd.md > Features and Behavior > Drop a pin to guess + Play five rounds against an AI.
export default function GuessMap({ guess, aiGuess, truth, locked, onPick }) {
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
        {guess && <Marker position={[guess.lat, guess.lng]} icon={playerIcon} />}
        {aiGuess && <Marker position={[aiGuess.lat, aiGuess.lng]} icon={aiIcon} />}
        {truth && <Marker position={[truth.lat, truth.lng]} icon={truthIcon} />}
      </MapContainer>
    </div>
  );
}
