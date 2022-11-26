import { TRPCError } from "@trpc/server";
import { addMinutes, differenceInSeconds, isAfter } from "date-fns";
import type {
  ICustomCtx,
  IContextWithMiddlewareParams,
  IInputParams,
} from "~/types/router-params";

export async function fetchQuestionQuery(
  ctx: IContextWithMiddlewareParams,
  input: IInputParams<{
    submissionId: string;
  }>
) {
  const questionAnswers = await ctx.prisma.submissionQuestionAnswer.findMany({
    where: {
      submissionId: input.submissionId,
    },
  });

  const quantityQuestions = await ctx.prisma.submission.findUnique({
    where: {
      id: input.submissionId,
    },
    select: {
      quiz: {
        select: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      },
    },
  });

  const alreadyFetchedQuestionIds = questionAnswers.map((question) => {
    return question.questionId;
  });

  const inProgressQuestion = questionAnswers.find((questionAnswer) => {
    return questionAnswer.answered === false;
  });

  const currentQuestionNumber = alreadyFetchedQuestionIds.length;

  if (inProgressQuestion) {
    const currentQuestion = await ctx.prisma.question.findUnique({
      where: {
        id: inProgressQuestion.questionId,
      },
      include: {
        answers: true,
      },
    });

    const answerDeadline = addMinutes(inProgressQuestion.createdAt, 2);
    const isAnswerLate = isAfter(new Date(), answerDeadline);

    if (isAnswerLate) {
      return {
        status: "late",
        currentQuestionNumber,
        quantityQuestions: quantityQuestions?.quiz._count.questions,
        remainingTimeInSeconds: 0,
        description: currentQuestion?.description,
        submissionQuestionAnswerId: inProgressQuestion.id,
        answers: currentQuestion?.answers.map((answer) => {
          return {
            id: answer.id,
            description: answer.description,
          };
        }),
      };
    }

    return {
      status: "ongoing",
      currentQuestionNumber,
      quantityQuestions: quantityQuestions?.quiz._count.questions,
      remainingTimeInSeconds: differenceInSeconds(
        addMinutes(inProgressQuestion.createdAt, 2),
        new Date()
      ),
      description: currentQuestion?.description,
      submissionQuestionAnswerId: inProgressQuestion.id,
      answers: currentQuestion?.answers.map((answer) => {
        return {
          id: answer.id,
          description: answer.description,
        };
      }),
    };
  } else {
    const nextQuestion = await ctx.prisma.question.findFirst({
      where: {
        quizId: ctx.submission.quizId,
        id: {
          notIn: alreadyFetchedQuestionIds,
        },
      },
      include: {
        answers: true,
      },
    });

    if (!nextQuestion) {
      await ctx.prisma.submission.update({
        where: {
          id: input.submissionId,
        },
        data: {
          finishedAt: new Date(),
        },
      });

      if (ctx.userId) {
        const [user, quiz] = await Promise.all([
          ctx.prisma.user.findUnique({
            where: {
              id: ctx.userId,
            },
          }),
          ctx.prisma.quiz.findUnique({
            where: {
              id: ctx.submission.quizId,
            },
          }),
        ]);
      }

      return {
        status: "finished",
      };
    }

    const submissionQuestionAnswer =
      await ctx.prisma.submissionQuestionAnswer.create({
        data: {
          submissionId: input.submissionId,
          questionId: nextQuestion.id,
        },
      });

    const answerDeadline = addMinutes(submissionQuestionAnswer.createdAt, 2);
    const isAnswerLate = isAfter(new Date(), answerDeadline);

    if (isAnswerLate) {
      return {
        status: "late",
        currentQuestionNumber,
        quantityQuestions: quantityQuestions?.quiz._count.questions,
        remainingTimeInSeconds: 0,
        description: nextQuestion?.description,
        submissionQuestionAnswerId: submissionQuestionAnswer.id,
        answers: nextQuestion?.answers.map((answer) => {
          return {
            id: answer.id,
            description: answer.description,
          };
        }),
      };
    }

    return {
      status: "ongoing",
      currentQuestionNumber: currentQuestionNumber + 1,
      quantityQuestions: quantityQuestions?.quiz._count.questions,
      remainingTimeInSeconds: differenceInSeconds(
        addMinutes(submissionQuestionAnswer.createdAt, 2),
        new Date()
      ),
      description: nextQuestion?.description,
      submissionQuestionAnswerId: submissionQuestionAnswer.id,
      answers: nextQuestion?.answers.map((answer) => {
        return {
          id: answer.id,
          description: answer.description,
        };
      }),
    };
  }
}
