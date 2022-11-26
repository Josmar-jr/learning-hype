import { createSSGHelpers } from '@trpc/react/ssg'
import { appRouter } from './router'
import { prisma } from './db/client'

import superjson from 'superjson'

export const trpcSSG = createSSGHelpers({
  router: appRouter,
  ctx: {
    session: undefined,
    prisma,
    req: undefined,
    res: undefined,
  },
  transformer: superjson,
})
