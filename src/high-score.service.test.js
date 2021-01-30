import axios from "axios";

import { getHighScores, updateHighScore } from "./high-score.service";

jest.mock("axios");

describe("high-score.service", () => {
  describe("getHighScores", () => {
    it("fetches high scores", async () => {
      const data = [];
      axios.get.mockResolvedValue({ data });

      await getHighScores();

      expect(axios.get).toHaveBeenCalledWith("api/high-scores", {
        headers: { "Content-Type": "application/json" },
      });
    });

    it("sorts by totalPoints descending", async () => {
      const data = [
        { name: "Jane Doe", totalPoints: 157, clicks: 5 },
        { name: "Lily Allen", totalPoints: 234, clicks: 8 },
      ];
      axios.get.mockResolvedValue({ data });

      const highScores = await getHighScores();

      expect(highScores[0].name).toBe("Lily Allen");
    });

    it("extends high score entry with average points and a hashed id", async () => {
      const data = [{ name: "Jane Doe", totalPoints: 157, clicks: 5 }];
      axios.get.mockResolvedValue({
        data,
      });

      const highScores = await getHighScores();

      expect(highScores).toEqual([
        { ...data[0], averagePoints: 31.4, id: expect.any(String) },
      ]);
    });

    it("limits high scores to 10 entries", async () => {
      const data = [];
      for (let i = 0; i < 12; i++) {
        data.push({
          name: "Lily Allen",
          totalPoints: 234,
          clicks: 8,
        });
      }

      axios.get.mockResolvedValue({
        data,
      });

      const highScores = await getHighScores();

      expect(highScores.length).toBe(10);
    });
  });

  it("updates high scores", async () => {
    await updateHighScore({ name: "David", score: 180, clickCount: 2 });
    expect(axios.post).toHaveBeenCalledWith(
      "api/high-scores",
      { name: "David", totalPoints: 180, clicks: 2 },
      { headers: { "Content-Type": "application/json" } }
    );
  });
});
