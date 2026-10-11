import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icon paths under a bundler (Vite).
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// A distinct icon for the revealed true location (slice 3+).
const trueIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  className: "guessmap__true-marker",
});

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
// prd.md > Features and Behavior > Drop a pin to guess.
export default function GuessMap({ guess, truth, locked, onPick }) {
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
        {guess && <Marker position={[guess.lat, guess.lng]} />}
        {truth && <Marker position={[truth.lat, truth.lng]} icon={trueIcon} />}
      </MapContainer>
    </div>
  );
}
