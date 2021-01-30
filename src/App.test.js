import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getHighScores, updateHighScore } from "./high-score.service";

import App from "./App";

jest.mock("./high-score.service");

function highScoresSample() {
  return [
    { name: "Lily Allen", totalPoints: 234, clicks: 8, averagePoints: 29.25 },
    { name: "Jane Doe", totalPoints: 157, clicks: 5, averagePoints: 31.4 },
  ];
}

describe("App", () => {
  beforeEach(() => {
    getHighScores.mockResolvedValue(highScoresSample());
  });
  it("displays high scores", async () => {
    render(<App />);

    expect(getHighScores).toHaveBeenCalledWith();

    await screen.findByText(highScoresSample()[0].name);

    highScoresSample().forEach(
      ({ name, totalPoints, clicks, averagePoints }) => {
        const row = screen.getByText(name).closest("div");
        const { getByText } = within(row);
        expect(getByText(name)).toBeInTheDocument();
        expect(getByText(totalPoints)).toBeInTheDocument();
        expect(getByText(clicks)).toBeInTheDocument();
        expect(getByText(averagePoints)).toBeInTheDocument();
      }
    );
  });

  it("displays and submits data and then resets it", async () => {
    const randomSpy = jest.spyOn(global.Math, "random");
    randomSpy.mockReturnValueOnce(0.9);
    randomSpy.mockReturnValueOnce(1);

    render(<App />);

    await screen.findByText(highScoresSample()[0].name);

    expect(screen.getByText("score 0")).toBeInTheDocument();
    expect(screen.getByText("10 clicks remaining")).toBeInTheDocument();

    userEvent.click(screen.getByText("generate score"));
    expect(screen.getByText("score 80")).toBeInTheDocument();
    expect(screen.getByText("9 clicks remaining")).toBeInTheDocument();

    userEvent.click(screen.getByText("generate score"));
    expect(screen.getByText("score 180")).toBeInTheDocument();
    expect(screen.getByText("8 clicks remaining")).toBeInTheDocument();

    userEvent.type(screen.getByLabelText("Name"), "David");
    userEvent.click(screen.getByText("Submit"));

    expect(updateHighScore).toHaveBeenCalledWith({
      name: "David",
      score: 180,
      clickCount: 2,
    });

    await waitFor(() =>
      expect(screen.getByText("score 0")).toBeInTheDocument()
    );
    expect(screen.getByText("10 clicks remaining")).toBeInTheDocument();

    randomSpy.mockRestore();
  });

  it("handles max clicks reached by displaying message and disabling button", async () => {
    render(<App />);

    await screen.findByText(highScoresSample()[0].name);

    expect(screen.getByText("score 0")).toBeInTheDocument();
    expect(screen.getByText("10 clicks remaining")).toBeInTheDocument();

    for (let i = 0; i < 10; i++) {
      userEvent.click(screen.getByText("generate score"));
    }
    expect(
      screen.getByText("You have reached the maximum number of clicks!")
    ).toBeInTheDocument();
    expect(screen.getByText("generate score")).toBeDisabled();
  });
});
