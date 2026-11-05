import "server-only";
import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { simulateLatency } from "@/lib/latency";

const GENERIC_ERROR = "Something went wrong. Try again.";

const firstMessage = (value) => (Array.isArray(value) ? firstMessage(value[0]) : value);

const toFieldErrors = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([field, value]) => [
      field,
      Array.isArray(value) && value.some((entry) => entry && typeof entry === "object")
        ? value.map((entry) => (entry && Object.keys(entry).length ? toFieldErrors(entry) : null))
        : firstMessage(value),
    ]),
  );

function toFormErrors(data) {
  if (Array.isArray(data)) return { form: firstMessage(data) };
  if (!data || typeof data !== "object") return { form: GENERIC_ERROR };
  const { non_field_errors: nonField, detail, ...fields } = data;
  const form = firstMessage(nonField) ?? detail;
  return { ...toFieldErrors(fields), ...(form && { form }) };
}

export function toId(value) {
  if (!/^\d+$/.test(String(value))) throw new Error("Invalid id");
  return value;
}

export async function mutate(path, { method = "POST", body } = {}) {
  await simulateLatency();
  try {
    const data = await apiFetch(path, { method, body: body && JSON.stringify(body) });
    return { ok: true, data };
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    if (error.status === 401) redirect("/login");
    return { ok: false, errors: toFormErrors(error.data) };
  }
}