import { useState } from "react";
import { updateHighScore } from "./high-score.service";

const INITIAL_NAME = "";
const INITIAL_SCORE = 0;
const INITIAL_CLICK_COUNT = 0;
const MAX_CLICKS = 10;

function App() {
  const [name, setName] = useState(INITIAL_NAME);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [clickCount, setClickCount] = useState(INITIAL_CLICK_COUNT);

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleScore() {
    const aNumberBetweenMinus100And100 = Math.floor(Math.random() * 200 - 100);
    setScore((score) => score + aNumberBetweenMinus100And100);
    setClickCount((clickCount) => setClickCount(clickCount + 1));
  }

  async function handleSubmit() {
    try {
      await updateHighScore({ name, score, clickCount });
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
        <div>score {score}</div>
        <label>
          {"Name "}
          <input value={name} onChange={handleChange} />
        </label>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
        <div>
          <button
            type="button"
            onClick={handleScore}
            disabled={clickCount >= MAX_CLICKS}
          >
            generate score
          </button>
          <span>
            {clickCount >= 10
              ? "You have reached the maximum number of clicks!"
              : `${MAX_CLICKS - clickCount} clicks remaining`}
          </span>
        </div>
      </section>
    </div>
  );
}

export default App;
