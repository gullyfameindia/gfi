export function convertDateToDaysLeft(date: string | any) {
  if (typeof date !== "string") {
    console.warn("[convertDateToDaysLeft] Type of date passed is not a string");
    return date;
  }
  const targetDate = new Date(date);
  if (isNaN(targetDate.getTime())) {
    console.warn(
      "[convertDateToDaysLeft] Type of string passed as date is invalid",
    );
    return date;
  }
  const today = new Date();
  const differenceInMs = targetDate.getTime() - today.getTime();
  if (differenceInMs <= 0) {
    return 0;
  }
  const msInADay = 1000 * 60 * 60 * 24;
  return Math.ceil(differenceInMs / msInADay);
}
