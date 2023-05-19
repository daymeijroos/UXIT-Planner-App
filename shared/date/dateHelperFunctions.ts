export function getCurrentWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const milisecondsInADay = 86400000;
  const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / milisecondsInADay;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
}

export function convertAmsterdamTimezoneToUTC(dateString: string) {
  const date = new Date(dateString);
  date.setUTCHours(date.getUTCHours() - 2);
  return date.toISOString();
}

export function getFirstDayOfTheWeek(date: Date): Date {
  const year = date.getFullYear();
  const firstDayOfTheYear = new Date(year, 0, 1);
  const daysToFirstDayOfWeek = (getCurrentWeekNumber(date) - 1) * 7 - firstDayOfTheYear.getDay() + 1;

  return new Date(year, 0, daysToFirstDayOfWeek);
}

export function getDaysOfTheWeek(date: Date): Date[] {
  const year = date.getFullYear();
  const firstDayOfTheWeek = getFirstDayOfTheWeek(date);
  const daysOfTheWeek: Date[] = [];

  const daysInAWeek = 7;
  const millisecondsInADay = 24 * 60 * 60 * 1000;

  console.log("--------------------");
  for (let i = 0; i < daysInAWeek; i++) {
    const date = new Date(firstDayOfTheWeek.getTime() + (i + 1) * millisecondsInADay);
    date.setFullYear(year);
    daysOfTheWeek.push(date);
    console.log(daysOfTheWeek);
    console.log(`week:  + ${date.toDateString()}`);
    console.log(firstDayOfTheWeek.getTime() + (i + 1));
  }
  return daysOfTheWeek;
}
