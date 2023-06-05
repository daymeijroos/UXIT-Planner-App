
import { SplitDate } from "../../../shared/types/splitDate"
import { AvailabilityWeekWithAvailabilityWithShiftTypes, AvailabilityWithShiftTypes } from "../../types/availability"

export const getAvailabilityForDate = (availabilityWeeks: AvailabilityWeekWithAvailabilityWithShiftTypes[], date: SplitDate): AvailabilityWithShiftTypes | undefined => {
  if (!availabilityWeeks || availabilityWeeks.length <= 0) return undefined

  const remainder = date.week % availabilityWeeks.length
  const availabilityWeek = availabilityWeeks[remainder]
  const availability = availabilityWeek.availability.find((a) => {
    return a.weekday === date.weekday
  })
  return availability
}
