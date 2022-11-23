import type { Prisma, PrismaClient, Submission } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export type ICustomCtx<T> = T & {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  req: NextApiRequest | undefined;
  res: NextApiResponse | undefined;
};

export type IContextWithMiddlewareParams = {
  submission: Submission;
  sessionId: string | undefined;
  userId: string | undefined;
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  req: NextApiRequest | undefined;
  res: NextApiResponse | undefined;
};

export type IInputParams<T> = T;
