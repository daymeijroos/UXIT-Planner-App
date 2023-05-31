export function convertToAmsterdamTimezone(dateString: string) {
  const date = new Date(dateString);
  date.setUTCHours(date.getUTCHours() - 2);
  return date.toISOString();
}