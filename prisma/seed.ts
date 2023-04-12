import { PrismaClient } from "@prisma/client";
import {faker} from "@faker-js/faker";
import cuid from "cuid";

const prisma = new PrismaClient();

async function main() {
  // Create Shift Types
  const shiftType1 = await prisma.shift_Type.create({
    data: {
      name: "Balie",
      description: "De vrijwilliger wil bij de balie zitten."
    }
  });

  const shiftType2 = await prisma.shift_Type.create({
    data: {
      name: "Galerie",
      description: "De vrijwilliger wil bij de galerie staan."
    }
  });

  const shiftType3 = await prisma.shift_Type.create({
    data: {
      name: "Beide",
      description: "De vrijwilliger geeft zich op om bij beide de balie en galerie te staan."
    }
  });

  console.log("Shift Types created: ", shiftType1, shiftType2, shiftType3);

  // Genereer mockdata voor gebruikers, voorkeuren en standaard beschikbaarheid
  const users = [];
  for (let i = 0; i < 2; i++) {
    const availabilityId = cuid();
    const availabilityNextId = cuid();

    users.push(
      prisma.user.create({
        data: {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          email: faker.internet.email(),
          preference: {
            create: {
              preferedWorkHours: faker.datatype.number({ min: 1, max: 8 }),
              shift_type_id: i % 2 === 0 ? shiftType1.id : shiftType2.id,
              availability: {
                create: [
                  {
                    id: availabilityId + i.toString(),
                    weekday: 1,
                    sequence_start: true,
                    shift_types: {
                      connect: {
                        id: i % 2 === 0 ? shiftType1.id : shiftType2.id,
                      },
                    },
                  },
                  {
                    id: availabilityNextId + i.toString(),
                    weekday: 2,
                    sequence_start: false,
                    shift_types: {
                      connect: {
                        id: i % 2 === 0 ? shiftType1.id : shiftType2.id,
                      },
                    },
                    previous: {
                      connect: {
                        id: availabilityId + i.toString(),
                      },
                    },
                    next: {
                      connect: {
                        id: availabilityId + i.toString(),
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      })
    );
  }
  await Promise.all(users);

  // Genereer mockdata voor shifts
  const shifts = [];
  for (let i = 0; i < 10; i++) {
    const shiftStart = faker.date.future();
    const shiftEnd = new Date(shiftStart.getTime() + faker.datatype.number({ min: 1, max: 8 }) * 60 * 60 * 1000);
    shifts.push(
      prisma.shift.create({
        data: {
          start: shiftStart,
          end: shiftEnd,
        },
      })
    );
  }
  const createdShifts = await Promise.all(shifts);

  // Genereer mockdata voor staff_required
  const staffRequiredList = [];
  for (let i = 0; i < 10; i++) {
    staffRequiredList.push(
      prisma.staff_Required.create({
        data: {
          amount: faker.datatype.number({ min: 1, max: 5 }),
          shift_id: createdShifts[i % 10].id,
          shift_type_id: i % 2 === 0 ? shiftType1.id : shiftType2.id,
        },
      })
    );
  }
  await Promise.all(staffRequiredList);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
