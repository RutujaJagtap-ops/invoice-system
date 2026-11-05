"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { TAGS } from "@/lib/constants";
import { failure, success } from "@/lib/formatState";
import { toPayload } from "@/lib/invoiceDraft";
import { mutate, toId } from "@/lib/mutations";
import { hasErrors } from "@/lib/validators/common";
import { validateInvoice } from "@/lib/validators/invoice";

const parseDraft = (formData) => {
  try {
    return JSON.parse(formData.get("payload") ?? "{}") ?? {};
  } catch {
    return {};
  }
};

const refreshInvoiceTags = (id) =>
  [
    TAGS.invoices,
    TAGS.dashboard,
    TAGS.invoice(id),
    TAGS.publicInvoices,
  ].forEach(updateTag);

async function transition(id, action) {
  const result = await mutate(`/invoices/${toId(id)}/${action}/`);
  if (!result.ok) return failure(result.errors);
  refreshInvoiceTags(id);
  return success();
}

export async function saveInvoice(id, _prevState, formData) {
  const draft = parseDraft(formData);
  const errors = validateInvoice(draft);
  if (hasErrors(errors)) return failure(errors);

  const result = await mutate(id ? `/invoices/${toId(id)}/` : "/invoices/", {
    method: id ? "PUT" : "POST",
    body: toPayload(draft),
  });
  if (!result.ok) return failure(result.errors);

  refreshInvoiceTags(result.data.id);
  redirect(`/invoices/${result.data.id}`);
}

export async function sendInvoice(id) {
  return transition(id, "send");
}

export async function markInvoicePaid(id) {
  return transition(id, "mark-paid");
}

export async function deleteInvoice(id) {
  const result = await mutate(`/invoices/${toId(id)}/`, { method: "DELETE" });
  if (!result.ok) return failure(result.errors);
  refreshInvoiceTags(id);
  redirect("/invoices");
}
