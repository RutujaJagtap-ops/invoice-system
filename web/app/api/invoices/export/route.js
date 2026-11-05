import { ApiError, apiFetch } from "@/lib/api";
import { toCsv } from "@/lib/csv";
import { todayISO } from "@/lib/dates";

const FILTER_KEYS = ["status", "search", "ordering"];
const MAX_PAGES = 50;

const COLUMNS = [
  { header: "Invoice number", value: (row) => row.number },
  { header: "Client", value: (row) => row.client_name },
  { header: "Issue date", value: (row) => row.issue_date },
  { header: "Due date", value: (row) => row.due_date },
  { header: "Status", value: (row) => (row.is_overdue ? "overdue" : row.status) },
  { header: "GST rate (%)", value: (row) => Number(row.gst_rate) },
  { header: "Subtotal (INR)", value: (row) => row.subtotal },
  { header: "GST (INR)", value: (row) => row.gst_amount },
  { header: "Total (INR)", value: (row) => row.total },
];

const pickFilters = (searchParams) =>
  Object.fromEntries(
    FILTER_KEYS.map((key) => [key, searchParams.get(key)]).filter(([key, value]) => value && !(key === "status" && value === "all")),
  );

async function fetchAllInvoices(filters) {
  const rows = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const data = await apiFetch(`/invoices/?${new URLSearchParams({ ...filters, page: String(page), page_size: "100" })}`);
    rows.push(...data.results);
    if (!data.next) break;
  }
  return rows;
}

export async function GET(request) {
  try {
    const rows = await fetchAllInvoices(pickFilters(new URL(request.url).searchParams));
    return new Response(`\uFEFF${toCsv(COLUMNS, rows)}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="invoices-${todayISO()}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return new Response("Unauthorized", { status: 401 });
    console.error("Invoice export failed:", error);
    return new Response("Export unavailable", { status: 502 });
  }
}