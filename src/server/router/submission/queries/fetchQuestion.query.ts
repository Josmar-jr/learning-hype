import { TRPCError } from "@trpc/server";
import { addMinutes, differenceInSeconds, isAfter } from "date-fns";
import type { IContextParams, IInputParams } from "~/types/router-params";

export async function fetchQuestionQuery(
  ctx: IContextParams,
  input: IInputParams<{
    submissionId: string;
  }>
) {
  const submission = await ctx.prisma.submission.findUnique({
    where: {
      id: input.submissionId,
    },
    include: {
      questionAnswers: true,
    },
  });

  if (!submission) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The submission with the provided ID was not found.",
    });
  }

  // Get the submission status (what questions are already answered?)
  // Fetch the first non-answered question (if there is one)
  // Otherwise, fetch a random question that's not answered yet
  // Create a submission question answer with empty answer

  const alreadyFetchedQuestionIds = submission.questionAnswers.map(
    (question) => {
      return question.questionId;
    }
  );

  const inProgressQuestion = submission.questionAnswers.find(
    (questionAnswer) => {
      return questionAnswer.answerId === null;
    }
  );

  const currentQuestionNumber = alreadyFetchedQuestionIds.length || 1;

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
  }

  const nextQuestion = await ctx.prisma.question.findFirst({
    where: {
      quizId: submission.quizId,
      id: {
        notIn: alreadyFetchedQuestionIds,
      },
    },
    include: {
      answers: true,
    },
  });

  if (!nextQuestion) {
    return {
      status: "finished",
    };
  }

  const submissionQuestionAnswer =
    await ctx.prisma.submissionQuestionAnswer.create({
      data: {
        submissionId: submission.id,
        questionId: nextQuestion.id,
      },
    });

  const answerDeadline = addMinutes(submissionQuestionAnswer.createdAt, 2);
  const isAnswerLate = isAfter(new Date(), answerDeadline);

  if (isAnswerLate) {
    return {
      status: "late",
      currentQuestionNumber,
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
