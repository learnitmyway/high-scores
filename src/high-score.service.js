import axios from "axios";
import { v4 as uuid } from "uuid";

async function getHighScores() {
  const { data } = await axios.get("api/high-scores", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const sorted = [...data].sort((a, b) => b.totalPoints - a.totalPoints);
  const sliced = sorted.slice(0, 10);
  return sliced.map((entry) => ({
    ...entry,
    averagePoints:
      entry.clicks > 0
        ? Number((entry.totalPoints / entry.clicks).toFixed(2))
        : 0,
    id: uuid(entry),
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
