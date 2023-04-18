import React from 'react';
import { useRouter } from 'next/navigation';
//  import StaffingCard
 import { StaffingCard } from "../../components/overview-components/staffing-card";


const schedule = () => {
  const router = useRouter();
  return (
    <div className='overflow-y-auto h-[70vh]'>
      
      <StaffingCard staffing={{
        shift: {
          id: "1",
          // start and end are type Date 
          start: new Date(),
          end: new Date(),
          note: "test",
          staffings: [
            {
              user: {
                id: "1",
                first_name: "Niek"
              },
              shift_type: {
                id: "1",
                name: "balie"
              }
            },
            {
              user: {
                id: "2",
                first_name: "Henk"
              },
              shift_type: {
                id: "2",
                name: "zaal"
              }
            },
            {
              user: {
                id: "3",
                first_name: "Laura"
              },
              shift_type: {
                id: "2",
                name: "zaal"
              }
            }
          ]
        },

        shift_type: {
          id: "1",
          name: "balie"
        },
        user: {
          id: "1",
          first_name: "Niek"
        }
      }} />

      <StaffingCard staffing={{
              shift: {
                id: "1",
                // start and end are type Date 
                start: new Date(),
                end: new Date(),
                staffings: [
                  {
                    user: {
                      id: "1",
                      first_name: "Niek"
                    },
                    shift_type: {
                      id: "1",
                      name: "balie"
                    }
                  },
                  {
                    user: {
                      id: "2",
                      first_name: "Henk"
                    },
                    shift_type: {
                      id: "2",
                      name: "zaal"
                    }
                  },
                  {
                    user: {
                      id: "3",
                      first_name: "Laura"
                    },
                    shift_type: {
                      id: "2",
                      name: "zaal"
                    }
                  }
                ]
              },

              shift_type: {
                id: "1",
                name: "balie"
              },
              user: {
                id: "1",
                first_name: "Niek"
              }
      }} />

      <StaffingCard staffing={{
              shift: {
                id: "1",
                // start and end are type Date 
                start: new Date(),
                end: new Date(),
                staffings: [
                  {
                    user: {
                      id: "1",
                      first_name: "Niek"
                    },
                    shift_type: {
                      id: "1",
                      name: "balie"
                    }
                  },
                  {
                    user: {
                      id: "2",
                      first_name: "Henk"
                    },
                    shift_type: {
                      id: "2",
                      name: "zaal"
                    }
                  },
                  {
                    user: {
                      id: "3",
                      first_name: "Laura"
                    },
                    shift_type: {
                      id: "2",
                      name: "zaal"
                    }
                  }
                ]
              },

              shift_type: {
                id: "1",
                name: "balie"
              },
              user: {
                id: "1",
                first_name: "Niek"
              }
      }} />

      <StaffingCard staffing={{
              shift: {
                id: "1",
                // start and end are type Date 
                start: new Date(),
                end: new Date(),
                staffings: [
                  {
                    user: {
                      id: "1",
                      first_name: "Niek"
                    },
                    shift_type: {
                      id: "1",
                      name: "balie"
                    }
                  },
                  {
                    user: {
                      id: "2",
                      first_name: "Henk"
                    },
                    shift_type: {
                      id: "2",
                      name: "zaal"
                    }
                  },
                  {
                    user: {
                      id: "3",
                      first_name: "Laura"
                    },
                    shift_type: {
                      id: "2",
                      name: "zaal"
                    }
                  }
                ]
              },

              shift_type: {
                id: "1",
                name: "balie"
              },
              user: {
                id: "1",
                first_name: "Niek"
              }
      }} />

    </div>

  );
};

export default schedule;