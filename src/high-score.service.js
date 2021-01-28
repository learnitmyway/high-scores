async function updateHighScore({ name, score }) {
  await fetch("https://codesandbox.io/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, score }),
  });
}

export { updateHighScore };
