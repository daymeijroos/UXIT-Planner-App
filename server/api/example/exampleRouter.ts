import { Post, User } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  posts: publicProcedure
    .input(z.number().optional())
    .query(({ctx, input}) => {
      return ctx.prisma.post.findMany({
        take: input,
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
  createPost: protectedProcedure
    .input(z.object({
      title: z.string().nonempty(),
      content: z.string().nonempty(),
    }))
    .mutation(({ctx, input}) => {
      const post = ctx.prisma.post.create({
        data: {
          ...input,
          userName: ctx.session.user.name,

        },
      });
      return post;
    })
});
