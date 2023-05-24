import { api } from "../../../utils/api";
import { LoadingMessage } from "../loading-message";
import { CardList } from "../../atoms/card-list";
import { StaffingCard } from "./staffing-card";
import { StaffingWithColleagues } from "../../../types/StaffingWithColleagues";
import { Button } from "../../atoms/button";

export function PersonalStaffingList({ fromDate }: { fromDate?: Date }) {
  const personalStaffings = api.staffing.getPersonalStaffing.useInfiniteQuery({ fromDate, limit: 1 }, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor
    }
  });

  if (personalStaffings.isLoading) {
    return <LoadingMessage />;
  }

  if (personalStaffings.error) {
    return <div>
      {personalStaffings.error.message}
    </div>
  }

  const staffings = personalStaffings.data?.pages.flatMap((page) => page.items);
  return (
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-4xl font-bold w-full">Mijn diensten</h1>
      <CardList<StaffingWithColleagues> objects={staffings} CardLayout={
        (staffing) => {
          return <StaffingCard staffing={staffing} />
        }
      } />
      {personalStaffings.hasNextPage && <Button onPress={() => void personalStaffings.fetchNextPage()}>Load more</Button>}
      {staffings?.length === 0 && <p className="text-center m-4">Je hebt nog geen toekomstige diensten staan.</p>}
    </div>
  )
}