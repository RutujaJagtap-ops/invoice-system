import { Link } from "@mui/material";
import NextLink from "@/components/ui/nextLink";
import StatusChip from "@/components/invoices/statusChip";
import { formatDate } from "@/lib/format";
import { formatINR } from "@/lib/money";

export const invoiceColumns = [
  {
    field: "number",
    headerName: "Number",
    minWidth: 150,
    flex: 1,
    renderCell: ({ row, value }) => (
      <Link
        component={NextLink}
        href={`/invoices/${row.id}`}
        underline="hover"
        sx={{ fontWeight: 600, textDecoration: "underline" }}
      >
        {value}
      </Link>
    ),
  },
  { field: "client_name", headerName: "Client", minWidth: 180, flex: 1.5 },
  {
    field: "issue_date",
    headerName: "Issued",
    minWidth: 130,
    flex: 1,
    sortable: true,
    renderCell: ({ value }) => formatDate(value),
  },
  {
    field: "due_date",
    headerName: "Due",
    minWidth: 130,
    flex: 1,
    sortable: true,
    renderCell: ({ value }) => formatDate(value),
  },
  {
    field: "total",
    headerName: "Amount",
    minWidth: 130,
    flex: 1,
    align: "right",
    headerAlign: "right",
    renderCell: ({ value }) => formatINR(value),
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 110,
    renderCell: ({ row }) => (
      <StatusChip status={row.status} overdue={row.is_overdue} />
    ),
  },
];
