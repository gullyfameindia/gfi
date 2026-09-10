export function convertDateToChatTimePassed(date: string) {
  if (!date) return "";
  const isoDate = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - isoDate.getTime();
  if (diffInMs < 0) return "Just Now";
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears}y ago`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths}m ago`;
  } else if (diffInWeeks > 0) {
    return `${diffInWeeks}w ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays}d ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours}h ago`;
  } else if (diffInMins > 0) {
    return `${diffInMins}min ago`;
  } else {
    // If it's under 60 seconds
    return "Just now";
  }
}
