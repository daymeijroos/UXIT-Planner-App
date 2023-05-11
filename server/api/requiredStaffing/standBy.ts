import { connect } from "http2";
import { z } from "zod";
import { api } from "../../../src/utils/api";
import { createTRPCRouter, publicProcedure } from "../trpc";


export const requiredStaffing = createTRPCRouter({

    // Get shift_type where name = "reserve"
    getReserveType: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.shift_Type.findFirst({
        where: {
          name: "Reserve",
        },
      });
    }),

  // ( Ik probeer de function te testen op een random shift op donderdag om een reserve toe te voegen )
  // Get shift.id where start = convertToAmsterdamTimezone("2023-04-18T11:45:00.000Z") 
  getShift: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.shift.findFirst({
        where: {
          start: convertToAmsterdamTimezone("2023-04-20T11:45:00.000Z")
        },
      });
    }),

  // voeg een reserve required staff aan de gegeven shift
  createRequiredStandByStaffing: publicProcedure
  .input(
    z.object({
      shift_id: z.any(),
      amountOfStaffRequired: z.number(),
      shiftType_id:  z.any(),
    }))
  .mutation(async ({ctx, input}) => {
    await ctx.prisma.staff_Required.create({
      data: {
        amount: input.amountOfStaffRequired,
        shift_id: input.shift_id,
        shift_type_id: input.shiftType_id
      }
    })
  }),

  // change required staffing of a shift from type "reserve" to "Balie/Galarie"
  ChangeRequiredStandByTo: publicProcedure
  .input(
    z.object({
      // shift_id
      shift_id: z.string(),
    }))
  .query(async ({ctx, input}) => {
    // find staffing with shift_type -> name = "reserve" 
    const StandByStaff = await ctx.prisma.staff_Required.findFirst({
      where: {
        shift_id: input.shift_id,
        shift_type: {
          name: "Reserve"
        }
      }
    })
    // change staffing shift_type -> name = "Balie" 
    const updatedStaffRequired = await ctx.prisma.staff_Required.update({
      where: {
        id: StandByStaff?.id
      },
      data: {
        shift_type: {
          connect: {
            name: "Balie"
          }
        }
      }
    })
    return updatedStaffRequired
  } 
  ),
});

export type RequiredStaffingRouter = typeof requiredStaffing;

function convertToAmsterdamTimezone(dateString: string) {
  const date = new Date(dateString);
  date.setUTCHours(date.getUTCHours() - 2);
  return date.toISOString();
}

