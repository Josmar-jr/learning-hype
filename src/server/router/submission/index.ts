import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createRouter } from "../context";
import { startSubmissionMutation } from "./mutations/startSubmission.mutation";

export const submissionRouter = createRouter().mutation("start", {
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
