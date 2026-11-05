export const AUTH_COOKIE = "access_token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 12; // keep equal to Django ACCESS_TOKEN_LIFETIME

export const PAGE_SIZE = 10;

export const TAGS = {
  invoices: "invoices",
  invoice: (id) => `invoice-${id}`,
  clients: "clients",
  client: (id) => `client-${id}`,
  dashboard: "dashboard",
  publicInvoices: "public-invoices"
};

export const INVOICE_STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

export const GST_RATES = [0, 5, 12, 18, 28];
export const PAYMENT_TERMS_DAYS = 15;

