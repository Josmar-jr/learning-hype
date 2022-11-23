/* eslint-disable prefer-const */
import { z } from "zod";
import { createRouter } from "../context";

import { fetchQuestionQuery } from "./queries/fetchQuestion.query";
import { sendAnswerMutation } from "./mutations/sendAnswer.mutation";
import { TRPCError } from "@trpc/server";
import { parseCookies } from "nookies";

const submissionSessionSchema = z.object({
  submissionId: z.string().cuid(),
});

export const submissionSessionRouter = createRouter()
  .middleware(async ({ ctx, next, rawInput }) => {
    const result = submissionSessionSchema.safeParse(rawInput);

    if (!result.success) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const { sessionId, userId } = parseCookies({ req: ctx.req });

    const submission = await ctx.prisma.submission.findUnique({
      where: {
        id: result.data.submissionId,
      },
    });

    if (!submission) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Submission not found.",
      });
    }

    if (sessionId && submission?.sessionId !== sessionId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "This submission was created by another user.",
      });
    }

    if (userId && submission?.userId !== userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "This submission was created by another user.",
      });
    }

    if (submission.gaveUpAt) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You already gave up this submission.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        submission,
        sessionId,
        userId,
      },
    });
  })
  .query("get", {
    input: submissionSessionSchema,
    async resolve({ ctx, input }) {
      return await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
        include: {
          quiz: true,
        },
      });
    },
  })
  .query("fetchQuestion", {
    input: submissionSessionSchema,
    async resolve({ ctx, input }) {
      return await fetchQuestionQuery(ctx, input);
    },
  })
  .mutation("sendAnswer", {
    input: submissionSessionSchema.extend({
      submissionQuestionAnswerId: z.string().cuid(),
      answerId: z.string().cuid().nullish(),
    }),
    async resolve({ ctx, input }) {
      await sendAnswerMutation(ctx, input);
    },
  })
  .query("report", {
    input: submissionSessionSchema,
    async resolve({ ctx, input }) {
      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
        include: {
          user: true,
          quiz: true,
          questionAnswers: {
            include: {
              answer: true,
              question: {
                include: {
                  answers: {
                    where: {
                      isRightAnswer: true,
                    },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });

      if (!submission?.reportViewedAt && submission?.user) {
        await Promise.all([
          ctx.prisma.submission.update({
            where: {
              id: input.submissionId,
            },
            data: {
              reportViewedAt: new Date(),
            },
          }),
        ]);
      }

      if (!ctx.submission.result) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Submission not finished.",
        });
      }

      const report = submission?.questionAnswers.map((questionAnswer) => {
        return {
          question: {
            id: questionAnswer.questionId,
            description: questionAnswer.question.description,
          },
          userAnswer: questionAnswer.answer,
          rightAnswer: questionAnswer.question.answers[0],
        };
      });

      return {
        result: ctx.submission.result,
        quiz: submission?.quiz,
        report,
      };
    },
  });
