import { Suspense } from "react";
import { Skeleton, Stack } from "@mui/material";
import EmptyState from "@/components/ui/emptyState";
import PageHeader from "@/components/ui/pageHeader";
import SearchField from "@/components/ui/searchField";
import ClientTable from "@/components/clients/clientTable";
import { PAGE_SIZE } from "@/lib/constants";
import { firstParam, toPageNumber } from "@/lib/navigation";
import { getClients } from "@/lib/queries";

export const metadata = { title: "Clients" };

export default async function ClientsPage({ searchParams }) {
  const params = await searchParams;
  const search = firstParam(params.search) ?? "";
  const page = toPageNumber(firstParam(params.page));

  const { results, count } = await getClients({
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Clients"
      />
      <Suspense fallback={<Skeleton variant="rounded" height={40} />}>
        <SearchField placeholder="Search by name or email" />
      </Suspense>
      {results.length ? (
        <ClientTable clients={results} />
      ) : (
        <EmptyState
          title={search ? "No clients match your search" : "No clients yet"}
          description={
            search
              ? "Try a different name or email."
              : "Add a client to start invoicing."
          }
        />
      )}
    </Stack>
  );
}
