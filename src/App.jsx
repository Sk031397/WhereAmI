import { useState, useEffect } from "react";
import World3D from "./components/World3D.jsx";
import GuessMap from "./components/GuessMap.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import { locations } from "./data/locations.js";
import { initialState, isLocked, placeGuess, advance } from "./lib/gameState.js";

const REVEAL_LINGER_MS = 5000;

// Slice 4: the full loop. After the reveal lingers ~5s (3D stays flyable),
// the game auto-advances to the next location, looping back after the last.
export default function App() {
  const [state, setState] = useState(initialState);

  const current = locations[state.currentIndex];
  const locked = isLocked(state);
  const truth = state.phase === "revealed" ? current.answer : null;

  function handlePick(latlng) {
    setState((s) => placeGuess(s, latlng, locations));
  }

  // Once a result is revealed, hold ~5s then advance to the next place.
  // The World3D element stays mounted and interactive during the wait.
  useEffect(() => {
    if (state.phase !== "revealed") return;
    const timer = setTimeout(() => {
      setState((s) => advance(s, locations));
    }, REVEAL_LINGER_MS);
    return () => clearTimeout(timer);
  }, [state.phase, state.currentIndex]);

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
