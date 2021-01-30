import axios from "axios";
import hash from "object-hash";

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
    averagePoints: Number((entry.totalPoints / entry.clicks).toFixed(2)),
    id: hash(entry),
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
