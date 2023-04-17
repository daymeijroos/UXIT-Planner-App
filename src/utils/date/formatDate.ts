export function formatDate(date: Date) {
  const daysOfWeek = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
  const monthsOfYear = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const monthOfYear = monthsOfYear[date.getMonth()];

  return `${dayOfWeek} ${dayOfMonth} ${monthOfYear}`;
}