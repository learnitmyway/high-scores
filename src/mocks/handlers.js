import { rest } from "msw";

export const handlers = [
  rest.post("/api/high-scores", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        ...req.body,
      })
    );
  }),
];
