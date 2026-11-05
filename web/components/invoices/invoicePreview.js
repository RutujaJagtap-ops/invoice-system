"use client";

import { useSelector } from "react-redux";
import InvoiceDocument from "@/components/invoices/invoiceDocument";
import { fromPaise, lineAmountPaise } from "@/lib/money";
import { selectDraft, selectDraftTotals } from "@/store/invoiceDraftSlice";

export default function InvoicePreview({ issuerName }) {
  const draft = useSelector(selectDraft);
  const totals = useSelector(selectDraftTotals);

  const invoice = {
    number: draft.number || "New invoice",
    client_name: draft.client?.name ?? "Select a client",
    issue_date: draft.issue_date,
    due_date: draft.due_date,
    status: "draft",
    is_overdue: false,
    gst_rate: draft.gst_rate,
    notes: draft.notes,
    items: draft.items.map((item) => ({ ...item, amount: fromPaise(lineAmountPaise(item.quantity, item.unit_price)) })),
    subtotal: fromPaise(totals.subtotalPaise),
    gst_amount: fromPaise(totals.gstAmountPaise),
    total: fromPaise(totals.totalPaise),
  };

  return <InvoiceDocument invoice={invoice} issuerName={issuerName} />;
}