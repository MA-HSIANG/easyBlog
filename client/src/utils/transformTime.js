export function transformTime(timesTamp) {
  let d = new Date(timesTamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1);
  const day = String(d.getDate());

  return (timesTamp = `${year}/${month.padStart(2, "0")}/${day.padStart(
    2,
    "0"
  )}`);
}
