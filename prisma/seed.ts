import { PrismaClient } from "@prisma/client"
import { Role } from "./role"
import { Weekday } from "./weekday"
import { CalendarDate, Time, toCalendarDateTime, getDayOfWeek } from "@internationalized/date"

const prisma = new PrismaClient()

async function main() {
  //create user role
  const userRole = await prisma.role.create({
    data: {
      name: Role.USER,
      description: "Dit zijn de standaard gebruikers van de app."
    }
  })

  //create admin role
  const adminRole = await prisma.role.create({
    data: {
      name: Role.ADMIN,
      description: "Admin rol houd alle rechten om de planner te beheren."
    }
  })

  //create retired role
  const retiredRole = await prisma.role.create({
    data: {
      name: Role.RETIRED,
      description: "Retired rol is voor gebruikers die niet meer actief zijn binnen pulchri en dus ook niet gebruik mogen maken van de planner."
    }
  })

  // Create Shift Types
  // weet niet of dit de bedoeling was maar heb een 3e shifttype toegevoegd voor als de vrijwilliger bij beide kan staan
  const shiftType1 = await prisma.shift_Type.create({
    data: {
      name: "Balie",
      description: "De vrijwilliger wil bij de balie zitten."
    }
  })

  const shiftType2 = await prisma.shift_Type.create({
    data: {
      name: "Galerie",
      description: "De vrijwilliger wil bij de galerie staan."
    }
  })



  console.log("Shift Types created: ", shiftType1, shiftType2)

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
  const users = []


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
      }
    }
  })

  const mockUser1 = await prisma.user.create({
    data: {
      name: "Ronja",
      last_name: "van Boxtel",
      email: "example@gmail.com",
      role: {
        connect: {
          name: Role.USER
        }
      },
      preference: {
        create: {
          shift_type: {
            connect: {
              id: shiftType1.id
            }
          },
          availability_even_week: {
            create: {
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
          },
          availability_odd_week: {
            create: {
              availability: {
                create: [
                  {
                    weekday: Weekday.THURSDAY,
                    shift_types: {
                      connect: {
                        id: shiftType1.id
                      }
                    }
                  }
                ]
              }
            }
          },
          availability_flexible: {
            create: {
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
                  }
                ]
              }
            }
          },
        }
      }
    }
  })

  // const mockUser1 = await prisma.user.create({
  //   data: {
  //     name: "Ronja",
  //     last_name: "van Boxtel",
  //     email: "example@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.SUNDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.THURSDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             },
  //             { sequence: 2,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.TUESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.WEDNESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.FRIDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.SATURDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                 ]
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })



  // const mockUser2 = await prisma.user.create({
  //   data: {
  //     name: "Willem",
  //     last_name: "Bekker",
  //     email: "example2@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 6,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [

  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.THURSDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.FRIDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SUNDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser3 = await prisma.user.create({
  //   data: {
  //     name: "Ellen",
  //     last_name: "Coster",
  //     email: "example3@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 3,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.THURSDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser4 = await prisma.user.create({
  //   data: {
  //     name: "Wilbert",
  //     last_name: "van Dijk",
  //     email: "example4@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 2,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SUNDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser5 = await prisma.user.create({
  //   data: {
  //     name: "Willem",
  //     last_name: "Donkers",
  //     email: "example5@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 6,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [
  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.THURSDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.FRIDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SUNDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser6 = await prisma.user.create({
  //   data: {
  //     name: "Mariëtte",
  //     last_name: "Groen",
  //     email: "example6@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 3,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.TUESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.WEDNESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.SATURDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.TUESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.SATURDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })


  // const mockUser7 = await prisma.user.create({
  //   data: {
  //     name: "ELlen",
  //     last_name: "de Jongh",
  //     email: "example7@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 6,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [
  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.THURSDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.FRIDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SUNDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser8 = await prisma.user.create({
  //   data: {
  //     name: "Linda",
  //     last_name: "Liem",
  //     email: "example8@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 4,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.TUESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.SATURDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.SUNDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.TUESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.WEDNESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.SATURDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.SUNDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })


  // const mockUser9 = await prisma.user.create({
  //   data: {
  //     name: "Marijke",
  //     last_name: "Rodermond",
  //     email: "example9@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 2,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.WEDNESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.WEDNESDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   },
  //                   {
  //                     weekday: Weekday.THURSDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })


  // const mockUser10 = await prisma.user.create({
  //   data: {
  //     name: "Angelique",
  //     last_name: "Schröter",
  //     email: "example10@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 3,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [
  //                 {
  //                   weekday: Weekday.FRIDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SUNDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser11 = await prisma.user.create({
  //   data: {
  //     name: "Ingrid",
  //     last_name: "Vossenaar",
  //     email: "example11@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 6,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [

  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.THURSDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.FRIDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SUNDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser12 = await prisma.user.create({
  //   data: {
  //     name: "Hennie",
  //     last_name: "Vosters",
  //     email: "example12@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [

  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser13 = await prisma.user.create({
  //   data: {
  //     name: "Anja",
  //     last_name: "De Vries",
  //     email: "example13@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 3,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [

  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.THURSDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser14 = await prisma.user.create({
  //   data: {
  //     name: "Debbie",
  //     last_name: "Conink Westenberg",
  //     email: "example14@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 4,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [

  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SUNDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser15 = await prisma.user.create({
  //   data: {
  //     name: "Frits",
  //     last_name: "van der Zweep",
  //     email: "example15@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 3,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [

  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.THURSDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser16 = await prisma.user.create({
  //   data: {
  //     name: "Jacobine",
  //     last_name: "van Nieuwkuijk",
  //     email: "example16@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser17 = await prisma.user.create({
  //   data: {
  //     name: "Janine",
  //     last_name: "Ossewaarde",
  //     email: "example17@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 6,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [

  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.THURSDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.FRIDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //                 {
  //                   weekday: Weekday.SUNDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 },
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser18 = await prisma.user.create({
  //   data: {
  //     name: "Mirjam",
  //     last_name: "Alexi",
  //     email: "example18@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: []
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.SATURDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })


  // const mockUser19 = await prisma.user.create({
  //   data: {
  //     name: "Fenna",
  //     last_name: "Heezen",
  //     email: "example19@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [
  //                 {
  //                   weekday: Weekday.SATURDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser20 = await prisma.user.create({
  //   data: {
  //     name: "Linda",
  //     last_name: "van der Touw",
  //     email: "example20@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.SUNDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: []
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })


  // const mockUser21 = await prisma.user.create({
  //   data: {
  //     name: "Marcella",
  //     last_name: "van de Mortel",
  //     email: "example21@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [
  //                 {
  //                   weekday: Weekday.TUESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser22 = await prisma.user.create({
  //   data: {
  //     name: "Danielle",
  //     last_name: "Proper",
  //     email: "example22@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.FRIDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: []
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })


  // const mockUser23 = await prisma.user.create({
  //   data: {
  //     name: "Marcella",
  //     last_name: "Zietse",
  //     email: "example23@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: []
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.SUNDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })


  // const mockUser24 = await prisma.user.create({
  //   data: {
  //     name: "Paula",
  //     last_name: "Knotter",
  //     email: "example24@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: {
  //             sequence: 0,
  //             availability: {
  //               create: [
  //                 {
  //                   weekday: Weekday.WEDNESDAY,
  //                   shift_types: {
  //                     connect: {
  //                       id: shiftType1.id
  //                     }
  //                   }
  //                 }
  //               ]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })

  // const mockUser25 = await prisma.user.create({
  //   data: {
  //     name: "Sally",
  //     last_name: "Ann Hartmann",
  //     email: "example25@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.THURSDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: []
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })


  // const mockUser26 = await prisma.user.create({
  //   data: {
  //     name: "Ingrid",
  //     last_name: "Zichem",
  //     email: "example26@hotmail.com",
  //     role: {
  //       connect: {
  //         name: Role.USER
  //       }
  //     },
  //     preference: {
  //       create: {
  //         maxStaffings: 1,
  //         shift_type: {
  //           connect: {
  //             id: shiftType1.id
  //           }
  //         },
  //         availability_week: {
  //           create: [
  //             {
  //               sequence: 0,
  //               availability: {
  //                 create: [
  //                   {
  //                     weekday: Weekday.FRIDAY,
  //                     shift_types: {
  //                       connect: {
  //                         id: shiftType1.id
  //                       }
  //                     }
  //                   }
  //                 ]
  //               }
  //             },
  //             {
  //               sequence: 1,
  //               availability: {
  //                 create: []
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // })



  let startDate = new CalendarDate(2023, 1, 1)
  const endDate = new CalendarDate(2024, 1, 1)

  while (startDate.compare(endDate) < 0) {

    if (getDayOfWeek(startDate, 'en-US') === Weekday.MONDAY) {
      startDate = startDate.add({ days: 1 })
      continue
    }
    const firstShiftDateTime = toCalendarDateTime(startDate, new Time(11, 45))
    const secondShiftDateTime = toCalendarDateTime(startDate, new Time(14, 0))
    const endFirstShiftDateTime = toCalendarDateTime(startDate, new Time(15, 0))
    const endSecondShiftDateTime = toCalendarDateTime(startDate, new Time(17, 15))

    if (getDayOfWeek(startDate, 'en-US') === Weekday.SATURDAY || getDayOfWeek(startDate, 'en-US') === Weekday.SUNDAY) {
      await prisma.shift.create({
        data: {
          start: firstShiftDateTime.toDate('Europe/Amsterdam'),
          end: endSecondShiftDateTime.toDate('Europe/Amsterdam'),
          staff_required: {
            create: {
              amount: 2,
              shift_type: { connect: { id: shiftType1.id } }
            }
          }
        },
      })
      startDate = startDate.add({ days: 1 })
      continue
    }

    await prisma.shift.create({
      data: {
        start: firstShiftDateTime.toDate('Europe/Amsterdam'),
        end: endFirstShiftDateTime.toDate('Europe/Amsterdam'),
        staff_required: {
          create: {
            amount: 1,
            shift_type: { connect: { id: shiftType1.id } }
          }
        }
      },
    })

    const shift2 = await prisma.shift.create({
      data: {
        start: secondShiftDateTime.toDate('Europe/Amsterdam'),
        end: endSecondShiftDateTime.toDate('Europe/Amsterdam'),
        staff_required: {
          create: {
            amount: 1,
            shift_type: { connect: { id: shiftType1.id } }
          }
        }
      },
    })

    startDate = startDate.add({ days: 1 })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
      .catch((e) => { console.log(e) })
  });

