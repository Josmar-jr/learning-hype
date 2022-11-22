import { TRPCError } from "@trpc/server";

import type { IContextParams, IInputParams } from "~/types/router-params";

export async function sendAnswerMutation(
  ctx: IContextParams,
  input: IInputParams<{
    submissionQuestionAnswerId: string;
    answerId: string;
  }>
) {
  const submissionQuestionAnswer =
    await ctx.prisma.submissionQuestionAnswer.findUnique({
      where: {
        id: input.submissionQuestionAnswerId,
      },
    });

  if (!submissionQuestionAnswer) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The question you're trying to answer doesn't exist.",
    });
  }

  // TODO: Check date is still valid.
  // const answerDeadLine = new 

  await ctx.prisma.submissionQuestionAnswer.update({
    where: {
      id: submissionQuestionAnswer.id,
    },
    data: {
      answerId: input.answerId,
    },
  });
}
