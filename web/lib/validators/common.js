export const isBlank = (value) => !String(value ?? "").trim();

export const hasErrors = (errors) =>
  Object.values(errors).some((value) => (Array.isArray(value) ? value.some(Boolean) : Boolean(value)));

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const GSTIN_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;