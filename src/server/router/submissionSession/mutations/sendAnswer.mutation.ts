import { TRPCError } from "@trpc/server";
import { addMinutes, isAfter } from "date-fns";

import type {
  ICustomCtx,
  IContextWithMiddlewareParams,
  IInputParams,
} from "~/types/router-params";

export async function sendAnswerMutation(
  ctx: IContextWithMiddlewareParams,
  input: IInputParams<{
    answerId?: string | null | undefined;
    submissionId: string;
    submissionQuestionAnswerId: string;
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

  if (submissionQuestionAnswer.answerId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This question was already answered.",
    });
  }

  // TODO: Check date is still valid.
  const answerDeadline = addMinutes(submissionQuestionAnswer.createdAt, 2);
  const isAnswerLate = isAfter(new Date(), answerDeadline);

  if (isAnswerLate) {
    await ctx.prisma.submissionQuestionAnswer.update({
      where: {
        id: submissionQuestionAnswer.id,
      },
      data: {
        answerId: null,
        answeredAt: new Date(),
        answered: true,
      },
    });
  }

  // const answerDeadLine = new

  await ctx.prisma.submissionQuestionAnswer.update({
    where: {
      id: submissionQuestionAnswer.id,
    },
    data: {
      answerId: input.answerId,
      answeredAt: new Date(),
      answered: true,
    },
  });
}
