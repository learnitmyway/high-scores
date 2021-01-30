import axios from "axios";

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

export { updateHighScore };
