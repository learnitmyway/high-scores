import axios from "axios";
import hash from "object-hash";

async function getHighScores() {
  const { data } = await axios.get("api/high-scores", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const dataIncludingCurrentPlayer = [
    ...data,
    { name: "Current Player", totalPoints: 0, clicks: 0 },
  ];
  const sorted = [...dataIncludingCurrentPlayer].sort(
    (a, b) => b.totalPoints - a.totalPoints
  );
  const sliced = sorted.slice(0, 11);
  return sliced.map((entry) => ({
    ...entry,
    averagePoints:
      entry.clicks > 0
        ? Number((entry.totalPoints / entry.clicks).toFixed(2))
        : 0,
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
