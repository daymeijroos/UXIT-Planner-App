import { createServerSideHelpers } from '@trpc/react-query/server'
import { GetServerSidePropsContext } from 'next'
import { getServerAuthSession } from "../../server/auth-config"
import { prisma } from "../../server/db"
import { appRouter } from "../../server/api/root"
import superjson from "superjson"

export const serverSideHelper = async (ctx: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => createServerSideHelpers({
  router: appRouter,
  ctx: {
    session: await getServerAuthSession(ctx),
    prisma: prisma,
  },
  transformer: superjson,
})