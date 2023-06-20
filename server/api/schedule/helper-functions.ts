export function getWeekNumber(on: Date) {
  const startYearDate = new Date(on.getFullYear(), 0, 1)
  var daysSinceStartYear = Math.floor((on.getTime() - startYearDate.getTime()) /
    (24 * 60 * 60 * 1000))

  var weekNumber = Math.ceil(daysSinceStartYear / 7)
  return weekNumber
}