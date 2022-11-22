import type { IContextParams, IInputParams } from "~/types/router-params";

export async function getSubmissionQuery(
  ctx: IContextParams,
  input: IInputParams<{
    submissionId: string;
  }>
) {
  return await ctx.prisma.submission.findUnique({
    where: {
      id: input.submissionId,
    },
    include: {
      quiz: true,
    },
  });
}
