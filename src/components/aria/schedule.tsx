import React from 'react';
import { useRouter } from 'next/navigation';
//  import StaffingCard
 import { StaffingCard } from "../../components/overview-components/staffing-card";
import { api } from '../../utils/api';


const schedule = () => {
  const router = useRouter();

 

  const staffings = api.staffing.getStaffing.useQuery();

  if (staffings.isLoading) {
    return <div>loading...</div>;
  }

  if (staffings.error) {
    return <div>{staffings.error.message}</div>;
  }

  return (

    <div className='overflow-y-auto h-[70vh]'>
      
      <StaffingCard staffing={staffings.data[0]} />

      {/* <StaffingCard staffing={{
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
      }} /> */}

    </div>

  );
};

export default schedule;