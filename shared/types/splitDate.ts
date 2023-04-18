function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export class SplitDate {
  year: number;
  month: number;
  day: number;
  week: number;
  weekday: number;
  hour: number;
  minute: number;

  constructor(year: number, month: number, day: number, hour: number, minute: number) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.week = getWeekNumber(new Date(year, month, day));
    this.weekday = new Date(year, month, day).getDay();
    this.hour = hour;
    this.minute = minute;
  }

  public static fromDate(date: Date): SplitDate {
    return new SplitDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
  }

  public getDate(): Date {
    return new Date(this.year, this.month, this.day, this.hour, this.minute);
  }

  public getWeekStart(): Date {
    const date = new Date(this.year, this.month, this.day, this.hour, this.minute);
    const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  public getWeekEnd(): Date {
    const date = new Date(this.year, this.month, this.day, this.hour, this.minute);
    const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1) + 6;
    return new Date(date.setDate(diff));
  }
}