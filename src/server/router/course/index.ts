import { createRouter } from "../context";

export const courseRouter = createRouter().query("getAll", {
  async resolve({ ctx }) {
    return await ctx.prisma.course.findMany();
  },
});
