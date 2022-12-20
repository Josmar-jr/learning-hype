import superjson from "superjson";

import { createRouter } from "./context";
import { feedbackRouter } from "./feedback";
import { quizRouter } from "./quiz";
import { resultRouter } from "./result";
import { submissionRouter } from "./submission";
import { submissionSessionRouter } from "./submissionSession";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("quiz.", quizRouter)
  .merge("submission.", submissionRouter)
  .merge("submissionSession.", submissionSessionRouter)
  .merge("feedback.", feedbackRouter)
  .merge("submission.", resultRouter);

export type AppRouter = typeof appRouter;
