import { Stack } from "@mui/material";
import InvoiceBuilder from "@/components/invoices/invoiceBuilder";
import PageHeader from "@/components/ui/pageHeader";
import { verifySession } from "@/lib/dal";
import { emptyDraft } from "@/lib/invoiceDraft";

export const metadata = { title: "New invoice" };

export default async function NewInvoicePage() {
  const user = await verifySession();

  return (
    <Stack spacing={3}>
      <PageHeader title="New invoice" />
      <Stack
        sx={{
          py: 3,
          px: 2,
          borderRadius: 1,
          bgcolor: "background.paper",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <InvoiceBuilder initialDraft={emptyDraft()} issuerName={user.name} />
      </Stack>
    </Stack>
  );
}
