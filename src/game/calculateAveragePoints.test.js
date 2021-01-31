import calculateAveragePoints from "./calculateAveragePoints";
describe("calculateAveragePoints", () => {
  it("calculates average to two decimal places", () => {
    const entry = { name: "Jane Doe", totalPoints: 100, clicks: 3 };

    expect(calculateAveragePoints(entry)).toBe(33.33);
  });
  it("handles 0 clicks", async () => {
    const entry = { name: "Jane Doe", totalPoints: 0, clicks: 0 };

    expect(calculateAveragePoints(entry)).toBe(0);
  });
});
