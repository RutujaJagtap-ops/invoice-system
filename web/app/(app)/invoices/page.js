import { Suspense } from "react";
import { Skeleton, Stack, Box } from "@mui/material";
import EmptyState from "@/components/ui/emptyState";
import PageHeader from "@/components/ui/pageHeader";
import InvoiceFilters from "@/components/invoices/invoiceFilters";
import InvoiceTable from "@/components/invoices/invoiceTable";
import { PAGE_SIZE } from "@/lib/constants";
import { firstParam, toPageNumber } from "@/lib/navigation";
import { getInvoices } from "@/lib/queries";
import AddIcon from "@mui/icons-material/Add";
import LinkButton from "@/components/ui/linkButton";

export const metadata = { title: "Invoices" };

export default async function InvoicesPage({ searchParams }) {
  const params = await searchParams;
  const status = firstParam(params.status);
  const search = firstParam(params.search) ?? "";
  const page = toPageNumber(firstParam(params.page));
  const ordering = firstParam(params.ordering);

  const { results, count } = await getInvoices({
    status,
    search,
    page,
    ordering,
    pageSize: PAGE_SIZE,
  });
  const isFiltered = Boolean(search || (status && status !== "all"));

  const newInvoiceButton = (
    <Box
      sx={{ alignSelf: { xs: "flex-end", md: "flex-start" }, flexShrink: 0 }}
    >
      <LinkButton
        href="/invoices/new"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ height: 40, width: "auto", whiteSpace: "nowrap" }}
      >
        New invoice
      </LinkButton>
    </Box>
  );

  return (
    <Stack spacing={3}>
      <PageHeader title="Invoices" />
      <Stack
        sx={{
          py: 3,
          px: 2,
          borderRadius: 1,
          bgcolor: "background.paper",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          // alignItems={{ xs: "stretch", md: "flex-start" }}
          // justifyContent="space-between"
          sx={{ pb: 4 }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Suspense fallback={<Skeleton variant="rounded" height={104} />}>
              <InvoiceFilters />
            </Suspense>
          </Box>
          {newInvoiceButton}
        </Stack>
        {results.length ? (
          <InvoiceTable
            invoices={results}
            pagination={{ rowCount: count, pageSize: PAGE_SIZE }}
          />
        ) : (
          <EmptyState
            title={
              isFiltered ? "No invoices match your filters" : "No invoices yet"
            }
            description={
              isFiltered
                ? "Try a different status or search term."
                : "Create your first invoice to get started."
            }
          />
        )}
      </Stack>
    </Stack>
  );
}
