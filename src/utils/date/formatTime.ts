export function formatTime(date: Date) {
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}