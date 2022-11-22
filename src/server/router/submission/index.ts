/* eslint-disable prefer-const */
import { z } from "zod";
import { createRouter } from "../context";
import { startSubmissionMutation } from "./mutations/startSubmission.mutation";
import { getSubmissionQuery } from "./queries/getSubmission.query";
import { fetchQuestionQuery } from "./queries/fetchQuestion.query";
import { sendAnswerMutation } from "./mutations/sendAnswer.mutation";
import { TRPCError } from "@trpc/server";
import { parseCookies } from "nookies";

const submissionSessionSchema = z.object({
  submissionId: z.string().cuid(),
});

export const submissionRouter = createRouter()
  .query("get", {
    input: z.object({
      submissionId: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      return await getSubmissionQuery(ctx, input);
    },
  })
  .mutation("start", {
    input: z.object({
      quizId: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await startSubmissionMutation(input, ctx);
    },
  })
  .query("fetchQuestion", {
    input: z.object({
      submissionId: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      return await fetchQuestionQuery(ctx, input);
    },
  })
  .mutation("sendAnswer", {
    input: z.object({
      submissionQuestionAnswerId: z.string().cuid(),
      answerId: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      await sendAnswerMutation(ctx, input);
    },
  });
