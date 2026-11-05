import { Stack } from "@mui/material";
import PageHeader from "@/components/ui/pageHeader";
import { verifySession } from "@/lib/dal";
import { getInvoice } from "@/lib/queries";
import InvoiceDetail from "@/components/invoices/invoiceDetail";
import { firstParam } from "@/lib/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const invoice = await getInvoice(id);
  return { title: `Invoice ${invoice.number}` };
}

export default async function InvoiceDetailPage({ params }) {
  const { id } = await params;
  const [invoice, user] = await Promise.all([getInvoice(id), verifySession()]);

  return (
    <Stack spacing={3}>
      <PageHeader
        title={`Invoice ${invoice.number}`}
        subtitle={invoice.client_name}
      />

      <Stack
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: "16px",
          bgcolor: "#ffffff",
          border: "1px solid #e5eaf3",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          width: "100%",
        }}
      >
        <InvoiceDetail invoice={invoice} issuerName={user.name} />
      </Stack>
    </Stack>
  );
}
