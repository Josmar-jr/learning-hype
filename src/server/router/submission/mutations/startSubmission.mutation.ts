/* eslint-disable prefer-const */
import { randomUUID } from "crypto";
import type { Session } from "next-auth";
import { parseCookies, setCookie } from "nookies";

import type { ICustomCtx, IInputParams } from "~/types/router-params";

interface IParams {
  input: IInputParams<{
    quizId: string;
  }>;
  ctx: ICustomCtx<{
    session?: Session;
  }>;
}

export async function startSubmissionMutation({
  ctx,
  input,
}: IParams): Promise<{
  submissionId: string;
}> {
  let { sessionId = null, userId = null } = parseCookies({ req: ctx.req });

  debugger;

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
