import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import processAllShifts from "../../utils/generateSchedule";
import testShiftsMatchUserPreferences from "../../utils/testSchedule";
import { getUnfulfilledShifts } from "../../utils/getUnfulfilledShifts";
// input should have a start_date and an end_date
export const scheduleRouter = createTRPCRouter({

  getUnfulfilledShifts: publicProcedure
    .query(() => {
      return getUnfulfilledShifts()
    }),
  generate: publicProcedure
    .input(z.object({
      start_date: z.date(),
      end_date: z.date(),
    }).optional())
    .mutation(({input}) => {
      return processAllShifts(input?.start_date, input?.end_date)
        .then(() => console.log("Alle shifts zijn verwerkt."))
        .catch((error) => console.error("Er is een fout opgetreden:", error))
    }),
  test: publicProcedure
    .mutation(() => {
      return testShiftsMatchUserPreferences()
    }),
});