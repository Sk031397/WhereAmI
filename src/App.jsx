import World3D from "./components/World3D.jsx";
import { locations } from "./data/locations.js";

// Slice 1: drop the player into the first hand-picked location's 3D view.
// Round orchestration (guessing, scoring, advancing) arrives in later slices.
export default function App() {
  const current = locations[0];

  return (
    <div className="app">
      <World3D camera={current.camera} />
    </div>
  );
}
