import { render, screen } from "@testing-library/react";

import ScoreUpdater from "./ScoreUpdater";
describe("ScoreUpdater", () => {
  it("handles max clicks reached by displaying message and disabling button", () => {
    render(
      <ScoreUpdater score={999} onUpdateScore={jest.fn()} clickCount={10} />
    );

    expect(
      screen.getByText(
        "You have reached the maximum number of clicks! Please save your score or refresh the page to reset."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("UPDATE SCORE")).toBeDisabled();
  });
});
