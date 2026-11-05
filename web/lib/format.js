const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const monthFormat = new Intl.DateTimeFormat("en-IN", { month: "short" });
export const formatMonth = (yearMonth) => monthFormat.format(new Date(`${yearMonth}-01T00:00:00`));

export const formatDate = (isoDate) => (isoDate ? dateFormat.format(new Date(`${isoDate}T00:00:00`)) : "—");