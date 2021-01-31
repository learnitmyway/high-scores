import { useRef, useState } from "react";
import { useAsyncRetry } from "react-use";
import { v4 as uuid } from "uuid";

import LeaderBoard from "./LeaderBoard";
import ScoreUpdater from "./ScoreUpdater";
import SubmitScore from "./SubmitScore";

import { getHighScores, updateHighScore } from "./high-score.service";
import compareByTotalPointsDesc from "./compareByTotalPointsDesc";
import calculateAveragePoints from "./calculateAveragePoints";

const INITIAL_NAME = "";
const INITIAL_SCORE = 0;
const INITIAL_CLICK_COUNT = 0;
const NEW_PLAYER_NAME = "New Player";

function Game() {
  const [name, setName] = useState(INITIAL_NAME);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [clickCount, setClickCount] = useState(INITIAL_CLICK_COUNT);
  const [clientHighScores, setClientHighScores] = useState([]);
  const [isSubmitError, setSubmitError] = useState(false);
  const newPlayerTempId = useRef(null);

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
          const updatedNewPlayer = {
            ...entry,
            name: name || NEW_PLAYER_NAME,
            totalPoints: updatedScore,
            clicks: updatedClickCount,
            averagePoints: calculateAveragePoints({
              clicks: updatedClickCount,
              totalPoints: updatedScore,
            }),
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
        {clientHighScores && <LeaderBoard scores={clientHighScores} />}
        <ScoreUpdater
          score={score}
          onUpdateScore={handleScore}
          clickCount={clickCount}
        />
        <SubmitScore
          name={name}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitError={isSubmitError}
        />
      </section>
    </div>
  );
}

export default Game;
