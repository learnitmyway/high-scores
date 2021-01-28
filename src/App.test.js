import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import axios from "axios";

import App from "./App";

jest.mock("axios");

test("displays and submits data and then resets it", async () => {
  const randomSpy = jest.spyOn(global.Math, "random");
  randomSpy.mockReturnValueOnce(0.9);
  randomSpy.mockReturnValueOnce(1);

  render(<App />);

  expect(screen.getByText("score 0")).toBeInTheDocument();

  userEvent.click(screen.getByText("generate score"));
  userEvent.click(screen.getByText("generate score"));

  userEvent.type(screen.getByLabelText("Name"), "David");

  expect(screen.getByText("score 180")).toBeInTheDocument();

  userEvent.click(screen.getByText("Submit"));

  expect(axios.post).toHaveBeenCalledWith(
    "api/high-scores",
    { name: "David", score: 180 },
    { headers: { "Content-Type": "application/json" } }
  );

  await waitFor(() => expect(screen.getByText("score 0")).toBeInTheDocument());
});
