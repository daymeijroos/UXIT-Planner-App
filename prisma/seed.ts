import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
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

  // user 1
  const availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Robert",
        last_name: "Swarts",
        email: "robertswarts@pulchri.nl",
        preference: {
          create: {
            preferedWorkHours: 2,
            shift_type_id: shiftType1,
            availability: {
              create: [
                {
                  id: availabilityId,
                  weekday: 1,
                  sequence_start: true,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  }
                },
                {
                  id: cuid(),
                  weekday: 2,
                  sequence_start: false,
                  shift_types: {
                    connect: {
                      id: shiftType1.id
                    }
                  },
                  previous: {
                    connect: {
                      id: availabilityId
                    }
                  },
                  next: {
                    connect: {
                      id: availabilityId
                    }
                  }
                }
              ]
            }
          }
        }
      }
    })
  );

  // user 2
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        first_name: "Lars",
        last_name: "Baer",
        email: "larsbaer@pulchri.nl",
        preference: {
          create: {
            preferedWorkHours: 4,
            shift_type_id: shiftType3,
            availability: {
              create: [
                {
                  id: availabilityId,
                  weekday: 1,
                  sequence_start: true,
                  shift_types: {
                    connect: {
                      id: shiftType3.id
                    }
                  }
                },
                {
                  id: cuid(),
                  weekday: 2,
                  sequence_start: false,
                  shift_types: {
                    connect: {
                      id: shiftType3.id
                    }
                  },
                  previous: {
                    connect: {
                      id: availabilityId
                    }
                  },
                  next: {
                    connect: {
                      id: availabilityId
                    }
                  }
                }
              ]
            }
          }
        }
      }
    })
  );
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
          end: shiftEnd
        }
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
          shift_type_id: i % 2 === 0 ? shiftType1.id : shiftType2.id
        }
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
