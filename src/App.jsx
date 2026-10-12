import { useState, useEffect } from "react";
import World3D from "./components/World3D.jsx";
import GuessMap from "./components/GuessMap.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import FinalTally from "./components/FinalTally.jsx";
import { locations } from "./data/locations.js";
import {
  initialState,
  isLocked,
  placeGuess,
  advance,
  resetGame,
} from "./lib/gameState.js";

const REVEAL_LINGER_MS = 5000;

// Slice 5: the full gamified loop — scoring, running total, a fixed 5-round
// game, and a final tally with play-again.
export default function App() {
  const [state, setState] = useState(initialState);

  const current = locations[state.currentIndex];
  const locked = isLocked(state);
  const truth = state.phase === "revealed" ? current.answer : null;

  function handlePick(latlng) {
    setState((s) => placeGuess(s, latlng, locations));
  }

  function handlePlayAgain() {
    setState(resetGame());
  }

  // Once a result is revealed, hold ~5s then advance. On the final round,
  // advance() switches to the "finished" phase (tally) instead of continuing.
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
      <Scoreboard
        phase={state.phase}
        round={state.round}
        distanceKm={state.distanceKm}
        roundPoints={state.roundPoints}
        totalScore={state.totalScore}
      />
      <GuessMap
        guess={state.guess}
        truth={truth}
        locked={locked}
        onPick={handlePick}
      />
      {state.phase === "finished" && (
        <FinalTally totalScore={state.totalScore} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
