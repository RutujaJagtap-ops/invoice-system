import "server-only";
import { notFound, redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { TAGS } from "@/lib/constants";
import { simulateLatency } from "@/lib/latency";
import { toQuery } from "@/lib/queryString";

const DEFAULT_REVALIDATE = 300; // seconds; tags invalidate sooner after mutations

async function get(
  path,
  { tags, revalidate = DEFAULT_REVALIDATE, auth = true },
) {
  await simulateLatency();
  try {
    return await apiFetch(path, { next: { tags, revalidate } });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) redirect("/login");
      if (error.status === 404) notFound();
    }
    throw error;
  }
}

export const getDashboardSummary = () =>
  get("/dashboard/summary/", { tags: [TAGS.dashboard], revalidate: 60 });

export const getInvoices = ({
  status,
  search,
  page,
  client,
  pageSize,
  ordering,
} = {}) =>
  get(
    `/invoices/${toQuery({ status: status === "all" ? "" : status, search, page, client, ordering, page_size: pageSize })}`,
    { tags: [TAGS.invoices] },
  );

export const getInvoice = (id) =>
  get(`/invoices/${encodeURIComponent(id)}/`, { tags: [TAGS.invoice(id)] });

export const getClients = ({ search, page, pageSize, ordering } = {}) =>
  get(`/clients/${toQuery({ search, page, ordering, page_size: pageSize })}`, {
    tags: [TAGS.clients],
  });

export const getClient = (id) =>
  get(`/clients/${encodeURIComponent(id)}/`, { tags: [TAGS.client(id)] });

export const getPublicInvoice = (token) =>
  get(`/public/invoices/${encodeURIComponent(token)}/`, {
    tags: [TAGS.publicInvoices],
    auth: false,
  });
