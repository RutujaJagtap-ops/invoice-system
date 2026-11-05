export const safeNext = (value, fallback = "/dashboard") =>
  typeof value === "string" && /^\/(?![/\\])/.test(value) ? value : fallback;

export const firstParam = (value) => (Array.isArray(value) ? value[0] : value);
export const toPageNumber = (value) =>
  Math.max(1, Number.parseInt(value, 10) || 1);

export const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
