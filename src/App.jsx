import { useState, useEffect } from "react";
import World3D from "./components/World3D.jsx";
import GuessMap from "./components/GuessMap.jsx";
import Scoreboard from "./components/Scoreboard.jsx";
import FinalTally from "./components/FinalTally.jsx";
import HintPanel from "./components/HintPanel.jsx";
import TypeGuess from "./components/TypeGuess.jsx";
import { locations } from "./data/locations.js";
import {
  initialState,
  isLocked,
  placeGuess,
  guessByName,
  advance,
  resetGame,
  takeHint,
  currentLocationIndex,
  roundNumber,
} from "./lib/gameState.js";

const REVEAL_LINGER_MS = 5000;

// Slice 6: the full gamified, competitive loop — randomized order, scoring,
// a simulated AI opponent, a 5-round game, and a You-vs-AI final tally.
export default function App() {
  // Seed the shuffled order once per game using the default Math.random.
  const [state, setState] = useState(() => initialState(undefined, locations.length));

  const current = locations[currentLocationIndex(state)];
  const locked = isLocked(state);
  const truth = state.phase === "revealed" ? current.answer : null;

  function handlePick(latlng) {
    setState((s) => placeGuess(s, latlng, locations));
  }

  function handlePlayAgain() {
    setState(resetGame(undefined, locations.length));
  }

  function handleHint() {
    setState((s) => takeHint(s));
  }

  function handleTypeGuess(text) {
    setState((s) => guessByName(s, text, locations));
  }

  // Once a result is revealed, hold ~5s then advance. On the final round,
  // advance() switches to the "finished" phase (tally) instead of continuing.
  useEffect(() => {
    if (state.phase !== "revealed") return;
    const timer = setTimeout(() => {
      setState((s) => advance(s));
    }, REVEAL_LINGER_MS);
    return () => clearTimeout(timer);
  }, [state.phase, state.roundIndex]);

  return (
    <div className="app">
      <World3D camera={current.camera} />
      {state.phase === "exploring" && (
        <HintPanel
          hints={current.hints}
          hintsUsed={state.hintsUsed}
          onHint={handleHint}
        />
      )}
      {state.phase === "exploring" && <TypeGuess onSubmit={handleTypeGuess} />}
      <Scoreboard
        phase={state.phase}
        round={roundNumber(state)}
        locationName={current.name}
        distanceKm={state.distanceKm}
        roundPoints={state.roundPoints}
        totalScore={state.totalScore}
        aiRoundPoints={state.aiRoundPoints}
        aiTotalScore={state.aiTotalScore}
      />
      <GuessMap
        guess={state.guess}
        aiGuess={state.phase === "revealed" ? state.aiGuess : null}
        truth={truth}
        roundPoints={state.roundPoints}
        aiRoundPoints={state.aiRoundPoints}
        locked={locked}
        onPick={handlePick}
      />
      {state.phase === "finished" && (
        <FinalTally
          totalScore={state.totalScore}
          aiTotalScore={state.aiTotalScore}
          winner={state.winner}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
