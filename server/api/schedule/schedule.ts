import { z } from "zod";

import { createTRPCRouter, publicProcedure, restrictedProcedure } from "../trpc";
import { generateSchedule } from "../../utils/schedule-generator-functions/generate-functions";
import { getUnfulfilledShifts } from "../../utils/getUnfulfilledShifts";
import { Role } from "../../../prisma/role";

export const scheduleRouter = createTRPCRouter({

  getUnfulfilledShifts: publicProcedure
    .query(() => {
      return getUnfulfilledShifts()
    }),
  generate: restrictedProcedure(Role.ADMIN)
    .input(z.object({
      from: z.date(),
      to: z.date(),
    }))
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        generateSchedule(input.from, input.to)
          .then(() => {
            resolve('Success');
          })
          .catch((error) => {
            reject(error);
          });
      });
    })
});