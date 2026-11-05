const escapeCell = (value) => {
  const text = String(value ?? "");
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export const toCsv = (columns, rows) =>
  [columns.map(({ header }) => escapeCell(header)), ...rows.map((row) => columns.map(({ value }) => escapeCell(value(row))))]
    .map((cells) => cells.join(","))
    .join("\r\n");