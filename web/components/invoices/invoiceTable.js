"use client";

import DataTable from "@/components/ui/dataTable";
import { invoiceColumns } from "@/components/invoices/invoiceColumns";

export default function InvoiceTable({
  invoices,
  compact = false,
  showClient = true,
  pagination,
}) {
  const hiddenFields = [
    ...(compact ? ["issue_date", "due_date"] : []),
    ...(showClient ? [] : ["client_name"]),
  ];
  return (
    <DataTable
      rows={invoices}
      columns={invoiceColumns}
      hiddenFields={hiddenFields}
      pagination={pagination}
    />
  );
}
