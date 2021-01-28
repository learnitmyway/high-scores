import axios from "axios";

async function updateHighScore({ name, score, clicks }) {
  await axios.post(
    "api/high-scores",
    { name, score, clicks },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export { updateHighScore };
