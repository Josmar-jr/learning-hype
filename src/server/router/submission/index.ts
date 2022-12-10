import { z } from "zod";

import { createRouter } from "../context";
import { startSubmissionMutation } from "./mutations/startSubmission.mutation";

export const submissionRouter = createRouter().mutation("start", {
  input: z.object({
    quizId: z.string(),
    userId: z.string(),
  }),
  async resolve({ input, ctx }) {
    return startSubmissionMutation({
      ctx,
      input,
    });
  },
});
