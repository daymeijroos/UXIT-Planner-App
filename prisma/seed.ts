import { PrismaClient } from "@prisma/client";
import cuid from "cuid";
import { Role } from "./role";
import { Weekday } from "./weekday";
import { convertToAmsterdamTimezone } from "../shared/functions/convertToAmsterdamTimezone";

const prisma = new PrismaClient();

async function main() {
  //create user role
  const userRole = await prisma.role.create({
    data: {
      name: Role.USER,
      description: "Dit zijn de standaard gebruikers van de app."
    }
  });

  //create admin role
  const adminRole = await prisma.role.create({
    data: {
      name: Role.ADMIN,
      description: "Admin rol houd alle rechten om de planner te beheren."
    }
  });

  //create retired role
  const retiredRole = await prisma.role.create({
    data: {
      name: Role.RETIRED,
      description: "Retired rol is voor gebruikers die niet meer actief zijn binnen pulchri en dus ook niet gebruik mogen maken van de planner."
    }
  });

  // Create Shift Types
  // weet niet of dit de bedoeling was maar heb een 3e shifttype toegevoegd voor als de vrijwilliger bij beide kan staan
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

  console.log("Shift Types created: ", shiftType1, shiftType2);

  // mockdata voor gebruikers, voorkeuren en standaard beschikbaarheid
  // user 1: robert swarts, elke dag, max 2x
  // user 2, lars baer, dinsdag/woensdag, max 2x
  // user 3, manuel vermeer, donderdag/vrijdag, max 2x
  // user 4, david sprong, zaterdag, max 1x
  // user 5, olivier verbeten, zondag, max 1x
  // user 6, emma beil, elke dag, max 4x
  // user 7, barbara damme, woensdag/zaterdag/zondag, max 1x
  // user 8, isabella host, dinsdag/woensdag, max 2x
  // user 9, marieke burckhard, donerdag/vrijdag/zaterdag, max 2x
  // user 10, maria nellessen, vrijdag/zaterdag/zondag, max 3x
  const users = [];


  // create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin",
      last_name: "Admin",
      email: process.env.ADMIN_EMAIL,
      role: {
        connect: {
          name: Role.ADMIN
        }
      },
      preference: {
        create: {
          maxStaffings: 2,
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_week: {
            create: {
              sequence: 0,
              availability: {
                create: [
                  {
                    weekday: Weekday.MONDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.TUESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.WEDNESDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SUNDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                ]
              }
            }
          }
        }
      }
    }
  });

  const adminTestShift = await prisma.shift.create({
    data: {
      start: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(6)).toISOString()),
      end: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10)).toISOString()),
      staff_required: {
        create: [
          {
            amount: 1,
            shift_type_id: shiftType1.id
          }
        ]
      }
    }
  });

  const adminTestShift2 = await prisma.shift.create({
    data: {
      start: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(6)).toISOString()),
      end: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(10)).toISOString()),
      staff_required: {
        create: [
          {
            amount: 1,
            shift_type_id: shiftType1.id
          }
        ]
      }
    }
  });

  const adminTestShift3 = await prisma.shift.create({
    data: {
      start: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(6)).toISOString()),
      end: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(10)).toISOString()),
      staff_required: {
        create: [
          {
            amount: 1,
            shift_type_id: shiftType1.id
          }
        ]
      }
    }
  });

  const adminTestShift4 = await prisma.shift.create({
    data: {
      start: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 4)).setHours(6)).toISOString()),
      end: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 4)).setHours(10)).toISOString()),
      staff_required: {
        create: [
          {
            amount: 1,
            shift_type_id: shiftType1.id
          }
        ]
      }
    }
  });

  const adminTestShift5 = await prisma.shift.create({
    data: {
      start: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 5)).setHours(6)).toISOString()),
      end: convertToAmsterdamTimezone(new Date(new Date(new Date().setDate(new Date().getDate() + 5)).setHours(10)).toISOString()),
      staff_required: {
        create: [
          {
            amount: 1,
            shift_type_id: shiftType1.id
          }
        ]
      }
    }
  });

  const dayUser = await prisma.user.create({
    data: {
      name: "Day",
      last_name: "Meijroos",
      email: "daymeijroos@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          maxStaffings: 2,
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_week: {
            create: {
              sequence: 0,
              availability: {
                create: [
                  {
                    weekday: Weekday.FRIDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                  {
                    weekday: Weekday.SATURDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  },
                ]
              }
            }
          }
        }
      }
    }
  });

  // user 1
  let availabilityId: string;
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        name: "Robert",
        last_name: "Swarts",
        email: "robertswarts@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.TUESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    },
                    {
                      weekday: Weekday.WEDNESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.THURSDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.FRIDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.SATURDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                  ]
                }
              }
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
        name: "Lars",
        last_name: "Baer",
        email: "larsbaer@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.TUESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    },
                    {
                      weekday: Weekday.WEDNESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                  ]
                }
              }
            }
          }
        }
      }
    })
  );

  // user 3
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        name: "Manuel",
        last_name: "Vermeer",
        email: "manuelvermeer@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.THURSDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    },
                    {
                      weekday: Weekday.FRIDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                  ]
                }
              }
            }
          }
        }
      }
    })
  );

  // user 4
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        name: "David",
        last_name: "Sprong",
        email: "davidsprong@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 1,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.SATURDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    })
  );

  // user 5
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        name: "Olivier",
        last_name: "Verbeten",
        email: "olivierverbeten@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 1,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.SUNDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        }
      }
    })
  );

  // user 6
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        name: "Emma",
        last_name: "Beil",
        email: "emmabeil@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 4,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.MONDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    },
                    {
                      weekday: Weekday.TUESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.WEDNESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.THURSDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.FRIDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.SATURDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.SUNDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                  ]
                }
              }
            }
          }
        }
      }
    })
  );

  // user 7
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        name: "Barbara",
        last_name: "Damme",
        email: "barbaradamme@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 1,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.WEDNESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    },
                    {
                      weekday: Weekday.SATURDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.SUNDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    }
                  ]
                }
              }
            }
          }
        }
      }
    })
  );

  // user 8
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        name: "Isabella",
        last_name: "Host",
        email: "isabellahost@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.TUESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    },
                    {
                      weekday: Weekday.WEDNESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    }
                  ]
                }
              }
            }
          }
        }
      }
    })
  );

  // user 9
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        name: "Marieke",
        last_name: "Burckhard",
        email: "mariekeburckhard@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 2,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.THURSDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    },
                    {
                      weekday: Weekday.FRIDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    }
                  ]
                }
              }
            }
          }
        }
      }
    })
  );

  // user 10
  availabilityId = cuid();
  users.push(
    prisma.user.create({
      data: {
        name: "Maria",
        last_name: "Nellessen",
        email: "marianellessen@pulchri.nl",
        preference: {
          create: {
            maxStaffings: 3,
            shift_type: {
              connect: {
                id: shiftType1.id
              }
            },
            availability_week: {
              create: {
                sequence: 0,
                availability: {
                  create: [
                    {
                      weekday: Weekday.MONDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      }
                    },
                    {
                      weekday: Weekday.TUESDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    },
                    {
                      weekday: Weekday.THURSDAY,
                      shift_types: {
                        connect: {
                          id: shiftType1.id
                        }
                      },
                    }
                  ]
                }
              }
            }
          }
        }
      }
    })
  );

  await Promise.all(users);

  // mockdata voor shifts
  const shifts = [];

  // dinsdag
  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-18T11:45:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-18T15:00:00.000Z")
      }
    }
    )
  );

  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-18T14:00:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-18T17:15:00.000Z")
      }
    }
    )
  );

  // woensdag
  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-19T11:45:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-19T15:00:00.000Z")
      }
    }
    )
  );

  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-19T14:00:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-19T17:15:00.000Z")
      }
    }
    )
  );

  // donderdag
  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-20T11:45:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-20T15:00:00.000Z")
      }
    }
    )
  );

  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-20T14:00:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-20T17:15:00.000Z")
      }
    }
    )
  );

  // vrijdag
  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-21T11:45:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-21T15:00:00.000Z")
      }
    }
    )
  );

  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-21T14:00:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-21T17:15:00.000Z")
      }
    }
    )
  );

  // zaterdag
  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-22T11:45:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-22T17:15:00.000Z")
      }
    }
    )
  );

  // zondag
  shifts.push(
    prisma.shift.create({
      data: {
        start: convertToAmsterdamTimezone("2023-04-23T11:45:00.000Z"),
        end: convertToAmsterdamTimezone("2023-04-23T17:15:00.000Z")
      },
    }
    )
  );

  const createdShifts = await Promise.all(shifts);

  // Genereer mockdata voor staff_required
  // willen we alleen balie rooster genereren of ook galerie (in het algemeen maar atm. voor demo)? Alles staat hier voorlopig op balie
  const staffRequiredList = [];

  // dinsdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[0].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[1].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // woensdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[2].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[3].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // donderdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[4].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[5].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // vrijdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[6].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 1,
        shift_id: createdShifts[7].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // zaterdag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 2,
        shift_id: createdShifts[8].id,
        shift_type_id: shiftType1.id
      }
    })
  );

  // zondag
  staffRequiredList.push(
    prisma.staff_Required.create({
      data: {
        amount: 2,
        shift_id: createdShifts[9].id,
        shift_type_id: shiftType1.id
      }
    })
  );

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

