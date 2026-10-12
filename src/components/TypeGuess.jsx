import { useState } from "react";

// Alternative to clicking the map: type the place name as your guess.
// Submitting locks the round (scored by gameState.guessByName). The minimap
// stays available — whichever the player does first wins.
// Implements prd.md > Features and Behavior > Or type the place name to guess.
export default function TypeGuess({ onSubmit }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <form className="typeguess" onSubmit={submit}>
      <input
        className="typeguess__input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Know it? Type the place…"
        aria-label="Type your guess"
        autoComplete="off"
      />
      <button className="typeguess__button" type="submit">
        Guess
      </button>
    </form>
  );
}
