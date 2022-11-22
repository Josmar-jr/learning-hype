import superjson from "superjson";

import { createRouter } from "./context";
import { courseRouter } from "./course";
import { quizRouter } from "./quiz";
import { resultRouter } from "./result";
import { submissionRouter } from "./submission";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("course.", courseRouter)
  .merge("quiz.", quizRouter)
  .merge("submission.", submissionRouter)
  .merge("submission.", resultRouter);

export type AppRouter = typeof appRouter;
