import axios from "axios";

async function updateHighScore({ name, score }) {
  await axios.post(
    "api/high-scores",
    { name, score },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export { updateHighScore };
