import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("displays high score", () => {
  const randomSpy = jest.spyOn(global.Math, "random");
  randomSpy.mockReturnValueOnce(0.9);
  randomSpy.mockReturnValueOnce(1);

  render(<App />);

  expect(screen.getByText("score 0")).toBeInTheDocument();

  userEvent.click(screen.getByText("generate score"));
  userEvent.click(screen.getByText("generate score"));

  expect(screen.getByText("score 180")).toBeInTheDocument();
});
