
import { connect } from "http2";
import { z } from "zod";
import { prisma } from "../db";
import { createTRPCRouter, publicProcedure, restrictedProcedure } from "./trpc";


export const shift = createTRPCRouter({

  
    // get list with name of each shift_type in the database
    getShiftTypes: publicProcedure
    .query(() => {
        return prisma.shift_Type.findMany({
            select: {
                name: true
            }
        })
    }
    ),

});

export type shift = typeof shift;




