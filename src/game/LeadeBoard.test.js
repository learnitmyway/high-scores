import { render, screen, waitFor } from "@testing-library/react";

import LeaderBoard from "./LeaderBoard";
describe("LeaderBoard", () => {
  it("displays max 10 items", async () => {
    const scores = [];
    for (let i = 0; i < 11; i++) {
      scores.push({
        name: "Jane Doe",
        totalPoints: i,
        clicks: 1,
        averagePoints: i,
        id: i.toString(),
      });
    }

    render(<LeaderBoard scores={scores} />);

    await waitFor(() => {
      expect(screen.getAllByText(scores[0].name)).toHaveLength(10);
    });
  });
});
