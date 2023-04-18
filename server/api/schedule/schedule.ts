import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { generateSchedule } from "../../utils/generateSchedule";
import { getUnfulfilledShifts } from "../../utils/getUnfulfilledShifts";

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
      /////////////////////////////////////////////////////////////////////////
      //Functie was zo snel dat het fake lijkt. Daarom een timeout van 700ms.//
      //IN PRODUCTION: Verwijder de timeout.                                 //
      /////////////////////////////////////////////////////////////////////////
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          generateSchedule(input?.start_date, input?.end_date)
            .then(() => {
              console.log("Alle shifts zijn verwerkt.");
              resolve('Success');
            })
            .catch((error) => {
              console.error("Er is een fout opgetreden:", error);
              reject(error);
            });
        }, 700);
      });
    })
});