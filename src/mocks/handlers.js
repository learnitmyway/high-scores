import { rest } from "msw";

const highScores = [
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

export const handlers = [
  rest.post("/api/high-scores", (req, res, ctx) => {
    highScores.push(req.body);
    return res(
      ctx.status(201),
      ctx.json({
        ...req.body,
      })
    );
  }),
  rest.get("/api/high-scores", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(highScores));
  }),
];
