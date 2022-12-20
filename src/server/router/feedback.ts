import { z } from "zod";
import { createRouter } from "./context";

export const feedbackRouter = createRouter().mutation("sendFeedback", {
  input: z.object({
    additionalInformation: z.string(),
    score: z.number(),
    userId: z.string(),
  }),
  async resolve({ ctx, input }) {
    return await ctx.prisma.feedback.create({
      data: {
        score: input.score,
        additionalInformation: input.additionalInformation,
        userId: input.userId,
      },
    });
  },
});
