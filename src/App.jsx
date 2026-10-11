import { useState } from "react";
import World3D from "./components/World3D.jsx";
import GuessMap from "./components/GuessMap.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import { locations } from "./data/locations.js";
import { initialState, isLocked, placeGuess } from "./lib/gameState.js";

// Slice 3: drop in, drop a locking pin, then see the distance score and the
// revealed true location. Auto-advance/loop arrives in slice 4.
export default function App() {
  const [state, setState] = useState(initialState);

  const current = locations[state.currentIndex];
  const locked = isLocked(state);
  const truth = state.phase === "revealed" ? current.answer : null;

  function handlePick(latlng) {
    setState((s) => placeGuess(s, latlng, locations));
  }

  return (
    <div className="app">
      <World3D camera={current.camera} />
      <Scoreboard phase={state.phase} distanceKm={state.distanceKm} />
      <GuessMap
        guess={state.guess}
        truth={truth}
        locked={locked}
        onPick={handlePick}
      />
    </div>
  );
}
