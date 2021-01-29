import { useState } from "react";
import { updateHighScore } from "./high-score.service";

const INITIAL_NAME = "";
const INITIAL_SCORE = 0;
const INITIAL_CLICK_COUNT = 0;

function App() {
  const [name, setName] = useState(INITIAL_NAME);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [clickCount, setClickCount] = useState(INITIAL_CLICK_COUNT);

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleScore() {
    setScore((score) => score + Math.floor(Math.random() * 200 - 100));
    setClickCount((clickCount) => setClickCount(clickCount + 1));
  }

  async function handleSubmit() {
    try {
      await updateHighScore({ name, score, clicks: clickCount });
    } catch (err) {
      // do nothing
    } finally {
      setName(INITIAL_NAME);
      setScore(INITIAL_SCORE);
      setClickCount(INITIAL_CLICK_COUNT);
    }
  }

  return (
    <div className="App">
      <section>
        <div>click counter {clickCount}</div>
        <div>score {score}</div>
        <input
          className="retro-input"
          placeholder="NAME"
          value={name}
          onChange={handleChange}
        />
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleScore}
            disabled={clickCount >= 10}
          >
            UPDATE SCORE
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
