import { useState } from "react";
import World3D from "./components/World3D.jsx";
import GuessMap from "./components/GuessMap.jsx";
import { locations } from "./data/locations.js";
import { initialState, isLocked, placeGuess } from "./lib/gameState.js";

// Slice 2: drop into a location AND let the player drop a locking pin on the
// always-visible corner map. Scoreboard + auto-advance arrive in later slices.
export default function App() {
  const [state, setState] = useState(initialState);

  const current = locations[state.currentIndex];
  const locked = isLocked(state);

  function handlePick(latlng) {
    setState((s) => placeGuess(s, latlng, locations));
  }

  return (
    <div className="app">
      <World3D camera={current.camera} />
      <GuessMap guess={state.guess} locked={locked} onPick={handlePick} />
    </div>
  );
}
