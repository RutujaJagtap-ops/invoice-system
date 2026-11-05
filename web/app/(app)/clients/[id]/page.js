import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmptyState from "@/components/ui/emptyState";
import NextLink from "@/components/ui/nextLink";
import PageHeader from "@/components/ui/pageHeader";
import InvoiceTable from "@/components/invoices/invoiceTable";
import { getClient, getInvoices } from "@/lib/queries";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const client = await getClient(id);
  return { title: client.name };
}

function Detail({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography sx={{ whiteSpace: "pre-wrap" }}>{value || "—"}</Typography>
    </Box>
  );
}

export default async function ClientDetailPage({ params }) {
  const { id } = await params;
  const [client, invoices] = await Promise.all([
    getClient(id),
    getInvoices({ client: id, pageSize: 10 }),
  ]);

  return (
    <Stack spacing={3}>
      <PageHeader
        title={client.name}
        subtitle={client.email}
        action={
          <Button
            component={NextLink}
            href="/clients"
            startIcon={<ArrowBackIcon />}
          >
            All clients
          </Button>
        }
      />
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            }}
          >
            <Detail label="Phone" value={client.phone} />
            <Detail label="GSTIN" value={client.gstin} />
            <Detail label="Address" value={client.address} />
          </Box>
        </CardContent>
      </Card>
      <Typography variant="h6" component="h2">
        Latest invoices
      </Typography>
      {invoices.results.length ? (
        <InvoiceTable invoices={invoices.results} showClient={false} />
      ) : (
        <EmptyState title="No invoices for this client yet" />
      )}
    </Stack>
  );
}
