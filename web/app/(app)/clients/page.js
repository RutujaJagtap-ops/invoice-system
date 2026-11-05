import { Suspense } from "react";
import { Skeleton, Stack, Box } from "@mui/material";
import EmptyState from "@/components/ui/emptyState";
import PageHeader from "@/components/ui/pageHeader";
import SearchField from "@/components/ui/searchField";
import ClientTable from "@/components/clients/clientTable";
import { PAGE_SIZE } from "@/lib/constants";
import { firstParam, toPageNumber } from "@/lib/navigation";
import { getClients } from "@/lib/queries";
import LinkButton from "@/components/ui/linkButton";
import AddIcon from "@mui/icons-material/Add";
    
export const metadata = { title: "Clients" };

export default async function ClientsPage({ searchParams }) {
  const params = await searchParams;
  const search = firstParam(params.search) ?? "";
  const page = toPageNumber(firstParam(params.page));
  const ordering = firstParam(params.ordering);

  const { results, count } = await getClients({
    search,
    page,
    ordering,
    pageSize: PAGE_SIZE,
  });

  return (
    <Stack spacing={3}>
      <PageHeader title="Clients" />
      <Stack
        sx={{
          py: 3,
          px: 2,
          borderRadius: 1,
          bgcolor: "background.paper",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Suspense fallback={<Skeleton variant="rounded" height={40} />}>
          <Stack direction="row" spacing={2} width="100%" sx={{ pb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <SearchField placeholder="Search by name or email" />
            </Box>

            <LinkButton
              href="/clients/new"
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add client
            </LinkButton>
          </Stack>
        </Suspense>
        {results.length ? (
          <ClientTable
            clients={results}
            pagination={{ rowCount: count, pageSize: PAGE_SIZE }}
          />
        ) : (
          <EmptyState
            title={search ? "No clients match your search" : "No clients yet"}
            description={
              search
                ? "Try a different name or email."
                : "Add a client to start invoicing."
            }
            actionLabel={search ? undefined : "Add client"}
            actionHref={search ? undefined : "/clients/new"}
          />
        )}
      </Stack>
    </Stack>
  );
}
