import * as trpc from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerAuthSession } from "../common/get-server-auth-session";
import { type Session } from "next-auth";

import { prisma } from "../db/client";

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = async (
  opts?: CreateNextContextOptions & CreateContextOptions
) => {
  return {
    prisma,
    session: opts?.session,
    req: opts?.req,
    res: opts?.res,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerAuthSession({ req, res });
  return await createContextInner({
    session,
    req,
    res,
  });
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
