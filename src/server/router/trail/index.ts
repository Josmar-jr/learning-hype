import { z } from "zod";
import { createRouter } from "../context";

export const trailRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.trail.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  })
  .query("getTrailer", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input }) {
      const quizzes = await ctx.prisma.trail.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          quizzes: true,
        },
      });

      return quizzes;
    },
  });
