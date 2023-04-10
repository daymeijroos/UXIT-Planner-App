import { getAvailabilityForWeek, getWeekNumber, userHasReachedMaxHours } from "./generateSchedule";
import { prisma } from "../db";

export default async function testShiftsMatchUserPreferences() {
  const allShifts = await prisma.staffing.findMany({
    include: {
      shift: true,
      user: {
        select: {
          id: true,
          preference: {
            include: {
              absence: true,
              availability: {
                include: {
                  shift_types: true,
                },
              },
              user: true,
              shift_type: true,
            },
          },
        },
      },
      shift_type: true,
    },
  });

  for (const staffing of allShifts) {
    const { shift, user, shift_type } = staffing;
    const { preference } = user;

    if (!preference) {
      console.log(
        `User ${user.id} heeft geen voorkeuren ingesteld, maar is ingepland voor shift ${shift.id} (shift type: ${shift_type.name})`
      );
      continue;
    }

    // Controleer of de gebruiker beschikbaar is op de datum van de shift
    const shiftDate = shift.start;
    const absenceForShiftDate = preference.absence.find((a) => {
      const absenceDate = {start: a.start, end: a.end};

      return (
        absenceDate.start.getFullYear() <= shiftDate.getFullYear() &&
        absenceDate.start.getMonth() <= shiftDate.getMonth() &&
        absenceDate.start.getDate() <= shiftDate.getDate()
        &&
        absenceDate.end.getFullYear() >= shiftDate.getFullYear() &&
        absenceDate.end.getMonth() >= shiftDate.getMonth() &&
        absenceDate.end.getDate() >= shiftDate.getDate()
      );
    });

    if (absenceForShiftDate) {
      console.log(
        `User ${user.id} is niet beschikbaar op de datum van shift ${shift.id} (shift type: ${shift_type.name})
        Shift date: ${shiftDate}`
      );
      continue;
    }

    // Controleer of het shifttype beschikbaar is voor de gebruiker
    const shiftTypeInPreferences = preference.availability.some(
      (availability) => availability.shift_types.some((type) => type.id === shift_type.id)
    );
    if (!shiftTypeInPreferences) {
      console.log(
        `Shift type ${shift_type.name} is niet beschikbaar voor user ${user.id} (shift ${shift.id})`
      );
      continue;
    }

    

    // Controleer of de gebruiker zijn maximale gewenste uren heeft bereikt
    const hasReachedMaxHours = await userHasReachedMaxHours(user.id, shift_type.id, shift.start);
    if (hasReachedMaxHours) {
      console.log(
        `User ${user.id} heeft het maximale aantal gewenste uren bereikt, maar is ingepland voor shift ${shift.id} (shift type: ${shift_type.name})`
      );
    } else {
      console.log(
        `Shift ${shift.id} (shift type: ${shift_type.name}) is correct ingepland voor user ${user.id}`
      );
    }

     // Controleer of de default availability van de gebruiker overeenkomt met de ingeplande shift
    const weekNumber = getWeekNumber(shift.start);
    const availabilityForWeek = await getAvailabilityForWeek(preference.user_id, weekNumber);
    if (!availabilityForWeek) {
      console.log(
        `User ${user.id} heeft geen default availability ingesteld voor de week van shift ${shift.id} (shift type: ${shift_type.name})`
      );
    } else if (!availabilityForWeek.shift_types.some((type) => type.id === shift_type.id)) {
      console.log(
        `User ${user.id} heeft ${shift_type.name} niet beschikbaar in de default availability voor de week van shift ${shift.id}`
      );
    }
  }
}