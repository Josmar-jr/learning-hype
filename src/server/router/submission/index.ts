import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createRouter } from "../context";
import { startSubmissionMutation } from "./mutations/startSubmission.mutation";

export const submissionRouter = createRouter()
  .middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  })
  .mutation("start", {
    input: z.object({
      quizId: z.string(),
    }),
    async resolve({ input, ctx }) {
      return startSubmissionMutation({
        ctx,
        input,
      });
    },
  });
