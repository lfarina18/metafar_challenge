export function getCurrentDay() {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 16);

  return formattedDate;
}
