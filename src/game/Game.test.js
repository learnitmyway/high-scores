import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { v4 as uuid } from "uuid";

import { getHighScores, updateHighScore } from "./high-score.service";

import Game from "./Game";

jest.mock("./high-score.service");
jest.mock("uuid");

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
  ];
}

describe("Game", () => {
  beforeEach(() => {
    randomSpy = jest.spyOn(global.Math, "random");
    getHighScores.mockResolvedValue(highScoresSample());
    uuid.mockReturnValue("a-unique-id");
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it("displays high scores", async () => {
    render(<Game />);

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

  it("inserts current player into leader board", async () => {
    const highScores = [
      {
        name: "Billy Allen",
        totalPoints: 234,
        clicks: 8,
        averagePoints: 29.25,
        id: "1",
      },
      {
        name: "Dane No",
        totalPoints: -157,
        clicks: 5,
        averagePoints: -31.4,
        id: "2",
      },
    ];

    getHighScores.mockResolvedValue(highScores);

    render(<Game />);

    const leaderBoardEntries = await screen.findAllByTestId("leaderBoardEntry");

    const { getByText, getAllByText } = within(leaderBoardEntries[1]);

    expect(getByText("New Player")).toBeInTheDocument();
    expect(getAllByText(0)).toHaveLength(3);
  });

  it("displays initial score and clicks remaining", async () => {
    render(<Game />);
    await screen.findByText(highScoresSample()[0].name);

    const scoreUpdateSection = await screen.findByTestId("ScoreUpdater");

    const { getByText } = within(scoreUpdateSection);
    expect(getByText("0")).toBeInTheDocument();
    expect(getByText("10 clicks remaining")).toBeInTheDocument();
  });

  it("updates score, leader board and clicks remaining", async () => {
    const highScores = [
      {
        name: "Wily Palin",
        totalPoints: 179,
        clicks: 8,
        averagePoints: 29.25,
        id: "1",
      },
      {
        name: "Insane Joe",
        totalPoints: 79,
        clicks: 5,
        averagePoints: -31.4,
        id: "2",
      },
    ];

    getHighScores.mockReturnValue(highScores);

    randomSpy.mockReturnValueOnce(0.9);
    randomSpy.mockReturnValueOnce(1);

    render(<Game />);

    await screen.findByText("New Player");

    userEvent.click(screen.getByText("UPDATE SCORE"));
    expect(screen.getAllByText("80")[0]).toBeInTheDocument();
    expect(screen.getByText("9 clicks remaining")).toBeInTheDocument();

    const leaderBoardEntries1 = await screen.findAllByTestId(
      "leaderBoardEntry"
    );
    const { getByText: getByText1, getAllByText: getAllByText1 } = within(
      leaderBoardEntries1[1]
    );
    expect(getByText1("New Player")).toBeInTheDocument();
    expect(getAllByText1("80")).toHaveLength(2); // average and total are both 80
    expect(getByText1("1")).toBeInTheDocument();

    userEvent.type(screen.getByLabelText("Name"), "David");

    userEvent.click(screen.getByText("UPDATE SCORE"));
    expect(screen.getAllByText("180")[0]).toBeInTheDocument();
    expect(screen.getByText("8 clicks remaining")).toBeInTheDocument();

    const leaderBoardEntries2 = await screen.findAllByTestId(
      "leaderBoardEntry"
    );
    const { getByText: getByText2 } = within(leaderBoardEntries2[0]);
    expect(getByText2("David")).toBeInTheDocument();
    expect(getByText2("180")).toBeInTheDocument();
    expect(getByText2("2")).toBeInTheDocument();
    expect(getByText2("90")).toBeInTheDocument();
  });

  it("submits total points and clicks, resets score and clicks remaining", async () => {
    randomSpy.mockReturnValueOnce(0.9);
    randomSpy.mockReturnValueOnce(1);

    render(<Game />);

    await screen.findByText(highScoresSample()[0].name);

    userEvent.click(screen.getByText("UPDATE SCORE"));
    userEvent.click(screen.getByText("UPDATE SCORE"));
    userEvent.type(screen.getByLabelText("Name"), "David");
    userEvent.click(screen.getByText("Save"));

    expect(updateHighScore).toHaveBeenCalledWith({
      name: "David",
      score: 180,
      clickCount: 2,
    });

    await waitFor(() => expect(screen.getByText("0")).toBeInTheDocument());
    expect(screen.getByText("10 clicks remaining")).toBeInTheDocument();
  });
  it("updates leader board after submitting", async () => {
    const name = "David";

    randomSpy.mockReturnValueOnce(0.9);
    randomSpy.mockReturnValueOnce(1);

    getHighScores.mockResolvedValueOnce(highScoresSample());

    render(<Game />);

    await screen.findByText(highScoresSample()[0].name);

    expect(getHighScores).toHaveBeenCalledTimes(1);

    userEvent.click(screen.getByText("UPDATE SCORE"));
    userEvent.click(screen.getByText("UPDATE SCORE"));
    userEvent.type(screen.getByLabelText("Name"), name);

    getHighScores.mockResolvedValueOnce([
      ...highScoresSample(),
      {
        name,
        totalPoints: 180,
        clicks: 2,
        averagePoints: 90,
        id: "a-new-unique-id",
      },
    ]);

    userEvent.click(screen.getByText("Save"));

    await screen.findByText("180");

    expect(getHighScores).toHaveBeenCalledTimes(2);

    const row = screen.getByText(name).closest("div");
    const { getByText } = within(row);
    expect(getByText(name)).toBeInTheDocument();
    expect(getByText("180")).toBeInTheDocument();
    expect(getByText("2")).toBeInTheDocument();
    expect(getByText("90")).toBeInTheDocument();
  });

  describe("error handling", () => {
    it("handles GET error", async () => {
      getHighScores.mockRejectedValue(new Error());

      render(<Game />);

      await waitFor(() =>
        expect(
          screen.getByText("Error: cannot display leader board")
        ).toBeInTheDocument()
      );
    });

    it("handles submit error", async () => {
      render(<Game />);

      await screen.findByText(highScoresSample()[0].name);

      updateHighScore.mockRejectedValue(new Error());

      userEvent.click(screen.getByText("Save"));

      await waitFor(() =>
        expect(
          screen.getByText("Error: cannot submit score")
        ).toBeInTheDocument()
      );
    });
  });
});
