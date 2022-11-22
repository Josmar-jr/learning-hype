import superjson from "superjson";

import { createRouter } from "./context";
import { trailRouter } from "./trail";
import { quizRouter } from "./quiz";
import { resultRouter } from "./result";
import { submissionRouter } from "./submission";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("trail.", trailRouter)
  .merge("quiz.", quizRouter)
  .merge("submission.", submissionRouter)
  .merge("submission.", resultRouter);

export type AppRouter = typeof appRouter;
