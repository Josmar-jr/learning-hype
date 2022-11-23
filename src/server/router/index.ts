import superjson from "superjson";

import { createRouter } from "./context";
import { trailRouter } from "./trail";
import { quizRouter } from "./quiz";
import { resultRouter } from "./result";
import { submissionRouter } from "./submission";
import { submissionSessionRouter } from "./submissionSession";
import { performanceRouter } from "./perfomance";
import { TRPCError } from "@trpc/server";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("trail.", trailRouter)
  .merge("quiz.", quizRouter)
  .merge("submission.", submissionRouter)
  .merge("submissionSession.", submissionSessionRouter)
  .merge("submission.", resultRouter)
  .middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
        oi: "io",
      },
    });
  })
  .merge("performance.", performanceRouter);

export type AppRouter = typeof appRouter;
