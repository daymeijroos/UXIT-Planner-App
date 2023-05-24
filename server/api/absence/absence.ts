// absence export

import { z } from "zod";
import {publicProcedure, createTRPCRouter, protectedProcedure} from "../trpc";

export const absenceRouter = createTRPCRouter({
    createAbsence: protectedProcedure

        .input(
            z.object({
                shift_id: z.string(),
                user_id: z.string(),
                reason: z.string()
            }))
        .mutation(async ({ ctx, input }) => {
            const shift = await ctx.prisma.shift.findUnique({
                where: { id: input.shift_id }
            });
            if (!shift) {
                throw new Error("Shift not found");
            }
            const startDateShift = shift.start;
            const endDateShift = shift.end;

            const user = await ctx.prisma.user.findUnique({
                where: { id: ctx.session.user.id },
                include: {
                    preference: true
                }
            });
            if (!user) {
                throw new Error("User not found");
            }
            const preferenceId = user.preference.id




                const absence = await ctx.prisma.absence.create({
                    data: {
                        start: startDateShift,
                        end: endDateShift,
                        reason: input.reason,
                        preference_id: preferenceId,
                    },
                });
                return absence;
            }
        ),
});
