import { z } from "zod";
import { createRouter } from "../context";

export const courseRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.course.findMany();
    },
  })
  .query("getCourse", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input }) {
      const quizzes = await ctx.prisma.course.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          quizzes: true
        }
      });

      return quizzes;
    },
  });
