/* eslint-disable prefer-const */
import { randomUUID } from "crypto";
import { parseCookies, setCookie } from "nookies";

import type { IContextParams, IInputParams } from "~/types/router-params";

export async function startSubmissionMutation(
  input: IInputParams<{
    quizId: string;
  }>,
  ctx: IContextParams
): Promise<{
  submissionId: string;
}> {
  let { sessionId = null, userId = null } = parseCookies({ req: ctx.req });

  if (!sessionId && !userId) {
    sessionId = randomUUID();

    setCookie({ res: ctx.res }, "sessionId", sessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 15, // 15 days
    });
  }

  const submission = await ctx.prisma.submission.create({
    data: {
      quizId: input.quizId,
      sessionId,
      userId,
    },
  });

  const submissionId = submission.id;

  return { submissionId };
}
