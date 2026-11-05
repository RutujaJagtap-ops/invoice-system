const TIME_ZONE = "Asia/Kolkata";

export const todayISO = () => new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

export function addDaysISO(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}