import axios from "axios";

import { getHighScores, updateHighScore } from "./high-score.service";

jest.mock("axios");

function highScoresSample() {
  return [
    { name: "Jane Doe", totalPoints: 157, clicks: 5 },
    { name: "Lily Allen", totalPoints: 234, clicks: 8 },
    { name: "John Smith", totalPoints: 390, clicks: 9 },
    { name: "Dane Joe", totalPoints: 197, clicks: 5 },
    { name: "Wily Ellen", totalPoints: 214, clicks: 9 },
    { name: "Son Mith", totalPoints: 990, clicks: 10 },
    { name: "Fane Doe", totalPoints: -157, clicks: 3 },
    { name: "Dilly Allen", totalPoints: -234, clicks: 9 },
    { name: "Ron Smith", totalPoints: -390, clicks: 5 },
    { name: "Fane Roe", totalPoints: -197, clicks: 4 },
    { name: "Nilly Allen", totalPoints: -214, clicks: 9 },
    { name: "Pon Smith", totalPoints: -990, clicks: 10 },
  ];
}

describe("high-score.service", () => {
  it("fetches high scores", async () => {
    axios.get.mockResolvedValue({ data: highScoresSample() });
    const highScores = await getHighScores();
    expect(axios.get).toHaveBeenCalledWith("api/high-scores", {
      headers: { "Content-Type": "application/json" },
    });
    expect(highScores).toEqual(highScoresSample());
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
