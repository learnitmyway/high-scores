import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import axios from "axios";

import App from "./App";

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

describe("App", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: highScoresSample() });
  });
  it("displays high scores", async () => {
    render(<App />);

    expect(axios.get).toHaveBeenCalledWith("api/high-scores", {
      headers: { "Content-Type": "application/json" },
    });

    await screen.findByText(highScoresSample()[0].name);

    highScoresSample().forEach(({ name, totalPoints, clicks }) => {
      const row = screen.getByText(name).closest("div");
      const { getByText } = within(row);
      expect(getByText(name)).toBeInTheDocument();
      expect(getByText(totalPoints)).toBeInTheDocument();
      expect(getByText(clicks)).toBeInTheDocument();
    });
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

    expect(axios.post).toHaveBeenCalledWith(
      "api/high-scores",
      { name: "David", score: 180, clicks: 2 },
      { headers: { "Content-Type": "application/json" } }
    );

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
