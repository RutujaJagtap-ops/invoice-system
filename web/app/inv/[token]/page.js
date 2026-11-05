import { notFound } from "next/navigation";
import { Container, Stack, Typography } from "@mui/material";
import InvoiceDocument from "@/components/invoices/invoiceDocument";
import PrintButton from "@/components/ui/printButton";
import { formatDate } from "@/lib/format";
import { formatINR } from "@/lib/money";
import { isUuid } from "@/lib/navigation";
import { getPublicInvoice } from "@/lib/queries";

const loadInvoice = (token) =>
  isUuid(token) ? getPublicInvoice(token) : notFound();

export async function generateMetadata({ params }) {
  const { token } = await params;
  const invoice = await loadInvoice(token);
  const title = `Invoice ${invoice.number} from ${invoice.issuer_name}`;
  const description = `${formatINR(invoice.total)} due ${formatDate(invoice.due_date)}.`;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description },
  };
}

export default async function PublicInvoicePage({ params }) {
  const { token } = await params;
  const invoice = await loadInvoice(token);

  return (
    <Container component="main" maxWidth="md" sx={{ py: { xs: 2, md: 5 } }}>
      <Stack spacing={3}>
        <Stack
          className="no-print"
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h6" component="h1">
            Invoice from {invoice.issuer_name}
          </Typography>
          <PrintButton />
        </Stack>
        <InvoiceDocument invoice={invoice} issuerName={invoice.issuer_name} />
      </Stack>
    </Container>
  );
}
