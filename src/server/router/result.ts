import { TRPCError } from "@trpc/server";
import { parseCookies } from "nookies";
import { z } from "zod";
import { createRouter } from "./context";

export const resultRouter = createRouter().query("result", {
  input: z.object({
    submissionId: z.string().cuid(),
  }),
  async resolve({ ctx, input }) {
    const submission = await ctx.prisma.submission.findUnique({
      where: {
        id: input.submissionId,
      },
      include: {
        quiz: true,
      },
    });

    const { sessionId } = parseCookies({ req: ctx.req });

    if (submission?.sessionId !== sessionId) {
      if (!submission) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "This submission was created by another user.",
        });
      }
    }

    if (!submission) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Submission not found.",
      });
    }

    let result = submission.result;

    if (!result) {
      const questionAnswers =
        await ctx.prisma.submissionQuestionAnswer.findMany({
          where: {
            submissionId: input.submissionId,
          },
          include: {
            question: true,
            answer: true,
          },
        });

      result = questionAnswers.reduce((result, questionAnswer) => {
        if (questionAnswer.answer?.isRightAnswer) {
          return result + questionAnswer.question.score;
        } else {
          return result;
        }
      }, 0);

      await ctx.prisma.submission.update({
        where: {
          id: input.submissionId,
        },
        data: {
          result,
        },
      });
    }

    const [quizApplicantsAmount, quizApplicantsWithLowerResultAmount] =
      await Promise.all([
        ctx.prisma.submission.count({
          where: {
            quizId: submission.quizId,
            result: {
              not: null,
            },
          },
        }),
        ctx.prisma.submission.count({
          where: {
            quizId: submission.quizId,
            result: {
              not: null,
              lt: result,
            },
          },
        }),
      ]);

    const betterThanPercentage = Math.round(
      (quizApplicantsWithLowerResultAmount * 100) / quizApplicantsAmount
    );

    return {
      result,
      quizTitle: submission.quiz.title,
      betterThanPercentage,
    };
  },
});
