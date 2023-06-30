import {createTRPCRouter, restrictedProcedure} from "../trpc"
import {z} from "zod";
import {Role} from "../../../prisma/role";

export const availabilityRouter = createTRPCRouter({

    addDefaultAvailability: restrictedProcedure(Role.ADMIN)
        .input(z.object({
            preferenceId: z.string()
        }))
        .mutation(async({input,ctx}) => {
            return ctx.prisma.availabilityEvenWeek.create(
                {
                    data: {
                        preference: {
                            connect: {
                                id: input.preferenceId
                            }
                        }
                    }
                }
            )
        })
})


