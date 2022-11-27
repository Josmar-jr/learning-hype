import superjson from "superjson";

import { createRouter } from "./context";
import { quizRouter } from "./quiz";
import { resultRouter } from "./result";
import { submissionRouter } from "./submission";
import { submissionSessionRouter } from "./submissionSession";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("quiz.", quizRouter)
  .merge("submission.", submissionRouter)
  .merge("submissionSession.", submissionSessionRouter)
  .merge("submission.", resultRouter);

export type AppRouter = typeof appRouter;
