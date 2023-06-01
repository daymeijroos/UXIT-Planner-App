import { z } from "zod";

import { createTRPCRouter, publicProcedure, restrictedProcedure } from "../trpc";
import { getUnfulfilledShifts } from "../../utils/getUnfulfilledShifts";
import { Role } from "../../../prisma/role";
import { generateSchedule } from "./generate-functions";

export const scheduleRouter = createTRPCRouter({
  getUnfulfilledShifts: publicProcedure
    .query(() => {
      return getUnfulfilledShifts();
    }),
  generate: restrictedProcedure(Role.ADMIN)
    .input(z.object({
      from: z.date(),
      to: z.date()
    }))
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        generateSchedule(input.from, input.to)
          .then(() => {
            resolve("Success");
          })
          .catch((error) => {
            reject(error);
          });
      });
    })
});
