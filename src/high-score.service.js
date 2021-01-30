import axios from "axios";

async function getHighScores() {
  const { data } = await axios.get("api/high-scores", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.map((entry) => ({
    ...entry,
    averagePoints: Number((entry.totalPoints / entry.clicks).toFixed(2)),
  }));
}

async function updateHighScore({ name, score, clickCount }) {
  await axios.post(
    "api/high-scores",
    { name, score, clicks: clickCount },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export { getHighScores, updateHighScore };
