import { connect } from "http2";
import { z } from "zod";
import { api } from "../../../src/utils/api";
import { createTRPCRouter, publicProcedure } from "../trpc";


export const requiredStaffing = createTRPCRouter({

  getReserveShiftType: publicProcedure
  .query(async ({ ctx }) => {
    return await ctx.prisma.shift_Type.findFirst({
      where: {
        name: "Reserve",
      },
    });
  }),

  // create required_staffing
  createRequiredStaffing: publicProcedure
    .input(
      z.object({
        shift_id: z.any(),
        amountOfStaffRequired: z.number(),
        shift_type_id: z.string(),
      }))
    .mutation(async ({ ctx, input }) => {
      const shift = await ctx.prisma.shift.findFirst({
        where: {
          id: input.shift_id,
        },
      });
      if (!shift) {
        throw new Error("Shift not found");
      }
      const shiftType = await ctx.prisma.shift_Type.findFirst({
        where: {
          id: input.shift_type_id
        },
      });
      if (!shiftType) {
        throw new Error("Shift Type name not found");
      }
      const requiredStaffing = await ctx.prisma.staff_Required.create({
        data: {
          shift_id: input.shift_id,
          amount: input.amountOfStaffRequired,
          shift_type_id: shiftType.id,
        },
      });
      return requiredStaffing;
    }),


  // update required_staffing
  updateRequiredStaffing: publicProcedure
  .input(
    z.object({
      id: z.any(),
      amountOfStaffRequired: z.any(),
      shiftType_id: z.any(),
      }))
      .mutation(async ({ctx, input}) => {
      await ctx.prisma.staff_Required.update({
      where: { 
        id: input.id
      },
      data: {
          amount: input.amountOfStaffRequired,
          shift_type_id: input.shiftType_id
        }
      })
    }),
            

  // Ceate new staffing
  CreateStaffing: publicProcedure
  .input(
    z.object({
      shift_id: z.string(),
      user_id: z.string(),
      shift_type_id: z.string(),
    }))
  .query(async ({ctx, input}) => {
    const staffing = await ctx.prisma.staffing.create({
      data: {
        user_id: input.user_id,
        shift_id: input.shift_id,
        shift_type_id: input.shift_type_id,
        }
      });
      return staffing;
  }),


  // Remove Staffing 
  RemoveStaffing: publicProcedure
  .input(
    z.object({
      shift_id: z.string(),
      user_id: z.string()
    }))
  .query(async ({ctx, input}) => {
    const staffing =
    await
    ctx
    .prisma
    .staffing
    .findFirst({
      where: {
        shift_id: input.shift_id,
        user_id: input.user_id
      }
    })
    if (staffing) {
      const staffingDeleted =
      await
      ctx
      .prisma
      .staffing
      .delete({
        where: {
          id: staffing.id
          }
        })
        return staffingDeleted
      }
      console.log("Staffin not found")
      return false
    }),

  // check if shift has reserve staffing 
  ShiftHasReserve: publicProcedure
  .input(
    z.object({
      shift_id: z.string()
      }))
      .query(async ({ctx, input}) => {
        const staffing =
        await
        ctx
        .prisma
        .staffing
        .findFirst({
          where: {
            shift_id: input.shift_id
            }
          })
          if (staffing) {
              return true
          }
            return false
    }),
              

  // Alter shift_type 
  ChangeStaffShiftType: publicProcedure
  .input(
    z.object({
      staffing_id: z.string(),
      shift_type_id: z.string()
    }))
  .query(async ({ctx, input}) => {
    const staffing = 
    await 
    ctx
    .prisma
    .staffing
    .findFirst({
      where: {
        id: input.staffing_id
      }
    })
    // Change the shift_type of the staffing to new shift_type (ex: Balie => Galarie)
    if (staffing) {
    const updatedStaffing = 
    await 
    ctx
    .prisma
    .staffing
    .update({
        where: {
          id: staffing?.id
        },
        data: {
          shift_type_id: input.shift_type_id
        }
      })
      return updatedStaffing
    }
  return null
  }),
});

export type RequiredStaffingRouter = typeof requiredStaffing;


