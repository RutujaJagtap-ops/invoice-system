import { redirect } from "next/navigation";
import { Stack } from "@mui/material";
import InvoiceBuilder from "@/components/invoices/invoiceBuilder";
import PageHeader from "@/components/ui/pageHeader";
import { verifySession } from "@/lib/dal";
import { draftFromInvoice } from "@/lib/invoiceDraft";
import { getInvoice } from "@/lib/queries";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  return { title: `Edit ${invoice.number}` };
}

export default async function EditInvoicePage({ params }) {
  const { id } = await params;
  const [invoice, user] = await Promise.all([getInvoice(id), verifySession()]);
  if (invoice.status === "paid") redirect(`/invoices/${id}`);

  return (
    <Stack spacing={3}>
      <PageHeader title={`Edit ${invoice.number}`} />
      <InvoiceBuilder initialDraft={draftFromInvoice(invoice)} issuerName={user.name} />
    </Stack>
  );
}