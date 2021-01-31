import { useRef, useState } from "react";
import { useAsyncRetry } from "react-use";
import { v4 as uuid } from "uuid";

import { getHighScores, updateHighScore } from "./high-score.service";
import compareByTotalPointsDesc from "./compareByTotalPointsDesc";
import calculateAveragePoints from "./calculateAveragePoints";

const INITIAL_NAME = "";
const INITIAL_SCORE = 0;
const INITIAL_CLICK_COUNT = 0;
const MAX_CLICKS = 10;
const NEW_PLAYER_NAME = "New Player";

function App() {
  const [name, setName] = useState(INITIAL_NAME);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [clickCount, setClickCount] = useState(INITIAL_CLICK_COUNT);
  const [clientHighScores, setClientHighScores] = useState([]);
  const [isSubmitError, setSubmitError] = useState(false);
  const newPlayerTempId = useRef("");

  const {
    error: isGetError,
    retry: refreshLeaderBoard,
  } = useAsyncRetry(async () => {
    const highScores = await getHighScores();
    newPlayerTempId.current = uuid();
    const newPlayer = {
      name: NEW_PLAYER_NAME,
      totalPoints: 0,
      clicks: 0,
      averagePoints: 0,
      id: newPlayerTempId.current,
    };
    const sorted = [...highScores, newPlayer].sort(compareByTotalPointsDesc);
    setClientHighScores(sorted);
  }, []);

  function handleChange(e) {
    setName(e.target.value.trim());
  }

  function handleScore() {
    const aNumberBetweenMinus100And100 = Math.floor(Math.random() * 200 - 100);
    const updatedScore = score + aNumberBetweenMinus100And100;
    const updatedClickCount = clickCount + 1;

    const updatedClientScores = clientHighScores
      .map((entry) => {
        const isNewPlayer = entry.id === newPlayerTempId.current;
        if (isNewPlayer) {
          const updatedNewPlayerNoAverage = {
            ...entry,
            name: name || NEW_PLAYER_NAME,
            totalPoints: updatedScore,
            clicks: updatedClickCount,
          };
          const updatedNewPlayer = {
            ...updatedNewPlayerNoAverage,
            averagePoints: calculateAveragePoints(updatedNewPlayerNoAverage),
          };
          return updatedNewPlayer;
        } else {
          return entry;
        }
      })
      .sort(compareByTotalPointsDesc);
    setScore(updatedScore);
    setClickCount(updatedClickCount);
    setClientHighScores(updatedClientScores);
  }

  async function handleSubmit() {
    try {
      await updateHighScore({ name, score, clickCount });
      refreshLeaderBoard();
      setName(INITIAL_NAME);
      setScore(INITIAL_SCORE);
      setClickCount(INITIAL_CLICK_COUNT);
    } catch (err) {
      setSubmitError(true);
    }
  }

  return (
    <div className="App">
      <section>
        {isGetError && (
          <p style={{ color: "red" }}>{"Error: cannot display leader board"}</p>
        )}
        {clientHighScores &&
          clientHighScores.map((entry, i) =>
            i < 10 ? (
              <div data-testid="leaderBoardEntry" key={entry.id}>
                <span>{entry.name} </span>
                <span>{entry.totalPoints} </span>
                <span>{entry.clicks} </span>
                <span>{entry.averagePoints} </span>
                <span>{entry.id} </span>
              </div>
            ) : null
          )}
        <div>score {score}</div>
        <label>
          {"Name "}
          <input value={name} onChange={handleChange} />
        </label>
        <button type="button" onClick={handleSubmit}>
          Send it!
        </button>
        <span style={{ color: "red" }}>
          {isSubmitError && " Error: cannot submit score"}
        </span>
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
              ? "You have reached the maximum number of clicks! Please send your score or refresh the page."
              : `${MAX_CLICKS - clickCount} clicks remaining`}
          </span>
        </div>
      </section>
    </div>
  );
}

export default App;
