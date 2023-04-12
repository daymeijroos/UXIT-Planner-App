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

  // mockdata voor gebruikers, voorkeuren en standaard beschikbaarheid
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
            shift_type_id: shiftType1.id,
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
            shift_type_id: shiftType3.id,
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

  shifts.push(
    prisma.shift.create({
      data: {
        create: [
          // dinsdag
          {
            start: "2023-04-25T11:45:00.000Z",
            end: "2023-04-25T15:00:00.000Z"
          },
          {
            start: "2023-04-25T14:00:00.000Z",
            end: "2023-04-25T17:15:00.000Z"
          },
          // woensdag
          {
            start: "2023-04-26T11:45:00.000Z",
            end: "2023-04-26T15:00:00.000Z"
          },
          {
            start: "2023-04-26T14:00:00.000Z",
            end: "2023-04-26T17:15:00.000Z"
          },
          // donderdag
          {
            start: "2023-04-27T11:45:00.000Z",
            end: "2023-04-27T15:00:00.000Z"
          },
          {
            start: "2023-04-27T14:00:00.000Z",
            end: "2023-04-27T17:15:00.000Z"
          },
          // vrijdag
          {
            start: "2023-04-28T11:45:00.000Z",
            end: "2023-04-28T15:00:00.000Z"
          },
          {
            start: "2023-04-28T14:00:00.000Z",
            end: "2023-04-28T17:15:00.000Z"
          },
          // zaterdag
          {
            start: "2023-04-29T11:45:00.000Z",
            end: "2023-04-29T17:15:00.000Z"
          },
          // zondag
          {
            start: "2023-04-30T11:45:00.000Z",
            end: "2023-04-30T17:15:00.000Z"
          }
        ]
      }
    })
  );
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
