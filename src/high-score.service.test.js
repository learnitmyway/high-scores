import axios from "axios";

import { getHighScores, updateHighScore } from "./high-score.service";

jest.mock("axios");

describe("high-score.service", () => {
  it("extends high score entry with average points", async () => {
    const data = [
      { name: "Jane Doe", totalPoints: 157, clicks: 5 },
      { name: "Lily Allen", totalPoints: 234, clicks: 8 },
    ];
    axios.get.mockResolvedValue({
      data,
    });

    const highScores = await getHighScores();

    const expected = [...data];
    expected[0] = { ...data[0], averagePoints: 31.4 };
    expected[1] = { ...data[1], averagePoints: 29.25 };
    expect(highScores).toEqual(expected);
  });
  it("fetches high scores", async () => {
    const data = [];
    axios.get.mockResolvedValue({ data });

    await getHighScores();

    expect(axios.get).toHaveBeenCalledWith("api/high-scores", {
      headers: { "Content-Type": "application/json" },
    });
  });

  it("updates high scores", async () => {
    await updateHighScore({ name: "David", score: 180, clickCount: 2 });
    expect(axios.post).toHaveBeenCalledWith(
      "api/high-scores",
      { name: "David", score: 180, clicks: 2 },
      { headers: { "Content-Type": "application/json" } }
    );
  });
});
