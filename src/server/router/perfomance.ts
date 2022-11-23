import { TRPCError } from "@trpc/server";
import { parseCookies } from "nookies";
import { z } from "zod";
import { createRouter } from "./context";

export const performanceRouter = createRouter()