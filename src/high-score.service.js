import axios from "axios";
import { v4 as uuid } from "uuid";

import calculateAveragePoints from "./calculateAveragePoints";
import compareByTotalPointsDesc from "./compareByTotalPointsDesc";

async function getHighScores() {
  const { data } = await axios.get("api/high-scores", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const sorted = [...data].sort(compareByTotalPointsDesc);
  const sliced = sorted.slice(0, 10);
  return sliced.map((entry) => ({
    ...entry,
    averagePoints: calculateAveragePoints({
      clicks: entry.clicks,
      totalPoints: entry.totalPoints,
    }),
    id: uuid(),
  }));
}

async function updateHighScore({ name, score, clickCount }) {
  await axios.post(
    "api/high-scores",
    { name, totalPoints: score, clicks: clickCount },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export { getHighScores, updateHighScore };
