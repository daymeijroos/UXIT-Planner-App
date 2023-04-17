import { prisma } from "../db";

export async function getUnfulfilledShifts() {
  const allShifts = await prisma.shift.findMany({
    where: {
      start: {
        gte: new Date(),
      },
    },
  });

  const unfulfilledShiftsPromise = allShifts.map(async (shift) => {
    let staff_required = await prisma.staff_Required.findMany({
      where: {
        shift_id: shift.id,
      },
    });

    return staff_required.map(async ({ amount, shift_type_id }) => {
      let staffingsCount = await prisma.staffing.count({
        where: {
          shift_id: shift.id,
          shift_type_id: shift_type_id,
        },
      });
      if (staffingsCount < amount) {
        return {
          shift_id: shift.id,
          shift_type_id: shift_type_id,
          amount_required: amount,
          amount_staffed: staffingsCount,
        }
      }
    });
  });

  const unfulfilledShifts = (await Promise.all((await Promise.all(unfulfilledShiftsPromise)).flat())).filter((shift) => typeof shift !== 'undefined');

  return unfulfilledShifts;
}