import { z } from "zod";

import { createTRPCRouter, publicProcedure, restrictedProcedure } from "../trpc";
import { generateSchedule } from "../../utils/generateSchedule";
import { getUnfulfilledShifts } from "../../utils/getUnfulfilledShifts";
import { Role } from "../../../prisma/role";

export const scheduleRouter = createTRPCRouter({

  getUnfulfilledShifts: publicProcedure
    .query(() => {
      return getUnfulfilledShifts()
    }),
  generate: restrictedProcedure(Role.ADMIN)
    .input(z.object({
      start_date: z.date(),
      end_date: z.date(),
    }).optional())
    .mutation(({ input }) => {
      return new Promise((resolve, reject) => {
        generateSchedule(input?.start_date, input?.end_date)
          .then(() => {
            console.log("Alle shifts zijn verwerkt.");
            resolve('Success');
          })
          .catch((error) => {
            console.error("Er is een fout opgetreden:", error);
            reject(error);
          });
      });
    })
});