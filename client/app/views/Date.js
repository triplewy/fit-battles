
export function formatDate(dateTime) {
  const date = new Date(dateTime)
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString("en-US", options)
}
