import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { getHighScores, updateHighScore } from "./high-score.service";

import App from "./App";

jest.mock("./high-score.service");

let randomSpy;

function highScoresSample() {
  return [
    {
      name: "Lily Allen",
      totalPoints: 234,
      clicks: 8,
      averagePoints: 29.25,
      id: "66b933a23017e192c41489caa45b01a6cf1a32a2",
    },
    {
      name: "Jane Doe",
      totalPoints: 157,
      clicks: 5,
      averagePoints: 31.4,
      id: "64c174ccfc516e0042c9accf9037162397717fe0",
    },
    {
      name: "Current Plater",
      totalPoints: 0,
      clicks: 0,
      averagePoints: 0,
      id: "an-id",
    },
  ];
}

describe("App", () => {
  beforeEach(() => {
    randomSpy = jest.spyOn(global.Math, "random");
    getHighScores.mockResolvedValue(highScoresSample());
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  // eslint-disable-next-line jest/no-conditional-expect
  it("displays high scores", async () => {
    render(<App />);

    expect(getHighScores).toHaveBeenCalledWith();

    await screen.findByText(highScoresSample()[0].name);

    highScoresSample().forEach(
      ({ name, totalPoints, clicks, averagePoints }) => {
        const row = screen.getByText(name).closest("div");
        const { getByText, getAllByText } = within(row);
        expect(getByText(name)).toBeInTheDocument();
        /* eslint-disable jest/no-conditional-expect */
        if (clicks === 0) {
          expect(getAllByText(0)).toHaveLength(3);
        } else {
          expect(getByText(totalPoints)).toBeInTheDocument();
          expect(getByText(clicks)).toBeInTheDocument();
          expect(getByText(averagePoints)).toBeInTheDocument();
        }
        /* eslint-disable jest/no-conditional-expect */
      }
    );
  });

  it("displays initial score and clicks remaining, resets score and clicks remaining", async () => {
    render(<App />);
    await screen.findByText(highScoresSample()[0].name);

    expect(screen.getByText("score 0")).toBeInTheDocument();
    expect(screen.getByText("10 clicks remaining")).toBeInTheDocument();
  });

  it("updates score and clicks remaining", async () => {
    randomSpy.mockReturnValueOnce(0.9);
    randomSpy.mockReturnValueOnce(1);

    render(<App />);

    await screen.findByText(highScoresSample()[0].name);

    userEvent.click(screen.getByText("generate score"));
    expect(screen.getByText("score 80")).toBeInTheDocument();
    expect(screen.getByText("9 clicks remaining")).toBeInTheDocument();

    userEvent.click(screen.getByText("generate score"));
    expect(screen.getByText("score 180")).toBeInTheDocument();
    expect(screen.getByText("8 clicks remaining")).toBeInTheDocument();
  });

  it("submits total points and clicks, resets score and clicks remaining", async () => {
    randomSpy.mockReturnValueOnce(0.9);
    randomSpy.mockReturnValueOnce(1);

    render(<App />);

    await screen.findByText(highScoresSample()[0].name);

    userEvent.click(screen.getByText("generate score"));
    userEvent.click(screen.getByText("generate score"));
    userEvent.type(screen.getByLabelText("Name"), "David");
    userEvent.click(screen.getByText("Send it!"));

    expect(updateHighScore).toHaveBeenCalledWith({
      name: "David",
      score: 180,
      clickCount: 2,
    });

    await waitFor(() =>
      expect(screen.getByText("score 0")).toBeInTheDocument()
    );
    expect(screen.getByText("10 clicks remaining")).toBeInTheDocument();
  });
  it("updates leader board after submitting", async () => {
    const name = "David";

    randomSpy.mockReturnValueOnce(0.9);
    randomSpy.mockReturnValueOnce(1);

    getHighScores.mockResolvedValueOnce(highScoresSample());

    render(<App />);

    await screen.findByText(highScoresSample()[0].name);

    expect(getHighScores).toHaveBeenCalledTimes(1);

    userEvent.click(screen.getByText("generate score"));
    userEvent.click(screen.getByText("generate score"));
    userEvent.type(screen.getByLabelText("Name"), name);

    getHighScores.mockResolvedValueOnce([
      ...highScoresSample(),
      {
        name,
        totalPoints: 180,
        clicks: 2,
        averagePoints: 90,
        id: "a-unique-id",
      },
    ]);

    userEvent.click(screen.getByText("Send it!"));

    await screen.findByText("180");

    expect(getHighScores).toHaveBeenCalledTimes(2);

    const row = screen.getByText(name).closest("div");
    const { getByText } = within(row);
    expect(getByText(name)).toBeInTheDocument();
    expect(getByText("180")).toBeInTheDocument();
    expect(getByText("2")).toBeInTheDocument();
    expect(getByText("90")).toBeInTheDocument();
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
