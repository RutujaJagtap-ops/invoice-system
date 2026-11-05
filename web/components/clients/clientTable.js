"use client";

import DataTable from "@/components/ui/dataTable";
import { clientColumns } from "@/components/clients/clientColumns";

export default function ClientTable({ clients, pagination }) {
  return (
    <DataTable rows={clients} columns={clientColumns} pagination={pagination} />
  );
}
