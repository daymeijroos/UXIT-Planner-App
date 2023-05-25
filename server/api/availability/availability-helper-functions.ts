
import { SplitDate } from "../../../shared/types/splitDate"
import { AvailabilityWeekWithAvailibilityWithShiftTypes, AvailabilityWithShiftTypes } from "../../utils/schedule-generator-types/availibility"

export const getAvailabilityForDate = (availabilityWeeks: AvailabilityWeekWithAvailibilityWithShiftTypes[], date: SplitDate): AvailabilityWithShiftTypes | undefined => {
  if (!availabilityWeeks || availabilityWeeks.length <= 0) return undefined

  const remainder = date.week % availabilityWeeks.length
  const availabilityWeek = availabilityWeeks[remainder]
  const availability = availabilityWeek.availability.find((a) => {
    return a.weekday === date.weekday
  })
  return availability
}