import { nanoid } from "@reduxjs/toolkit";
import { PAYMENT_TERMS_DAYS } from "@/lib/constants";
import { addDaysISO, todayISO } from "@/lib/dates";

export const blankItem = () => ({ key: nanoid(), description: "", quantity: "1", unit_price: "" });

export function emptyDraft() {
  const issueDate = todayISO();
  return {
    sourceId: "new",
    number: "",
    client: null,
    issue_date: issueDate,
    due_date: addDaysISO(issueDate, PAYMENT_TERMS_DAYS),
    gst_rate: 18,
    notes: "",
    items: [blankItem()],
  };
}

export const draftFromInvoice = (invoice) => ({
  sourceId: String(invoice.id),
  number: invoice.number,
  client: { id: invoice.client, name: invoice.client_name },
  issue_date: invoice.issue_date,
  due_date: invoice.due_date,
  gst_rate: Number(invoice.gst_rate),
  notes: invoice.notes,
  items: invoice.items.map((item) => ({
    key: String(item.id),
    description: item.description,
    quantity: String(Number(item.quantity)),
    unit_price: String(Number(item.unit_price)),
  })),
});

export const toPayload = (draft) => ({
  client: draft.client.id,
  issue_date: draft.issue_date,
  due_date: draft.due_date,
  gst_rate: draft.gst_rate,
  notes: draft.notes.trim(),
  items: draft.items.map(({ description, quantity, unit_price: unitPrice }) => ({
    description: description.trim(),
    quantity,
    unit_price: unitPrice,
  })),
});