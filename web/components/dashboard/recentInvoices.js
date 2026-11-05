import { Button, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import EmptyState from "@/components/ui/emptyState";
import NextLink from "@/components/ui/nextLink";
import InvoiceTable from "@/components/invoices/invoiceTable";
import { getInvoices } from "@/lib/queries";

export function RecentInvoicesSkeleton() {
  return <Skeleton variant="rounded" height={320} />;
}

export default async function RecentInvoices() {
  const { results } = await getInvoices({ pageSize: 5 });

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}
        >
          <Typography variant="h6" component="h2">
            Recent invoices
          </Typography>
          <Button component={NextLink} href="/invoices" size="small">
            View all
          </Button>
        </Stack>
        {results.length ? (
          <InvoiceTable invoices={results} compact />
        ) : (
          <EmptyState
            title="No invoices yet"
            description="Invoices you create will show up here."
          />
        )}
      </CardContent>
    </Card>
  );
}
