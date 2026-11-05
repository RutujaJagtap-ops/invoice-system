import { Link } from "@mui/material";
import NextLink from "@/components/ui/nextLink";

const orDash = ({ value }) => value || "—";

export const clientColumns = [
  {
    field: "name",
    headerName: "Name",
    minWidth: 180,
    flex: 1.5,
    sortable: true,
    renderCell: ({ row, value }) => (
      <Link
        component={NextLink}
        href={`/clients/${row.id}`}
        underline="hover"
        sx={{ fontWeight: 600, textDecoration: "underline" }}
      >
        {value}
      </Link>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 220,
    flex: 2,
    sortable: true,
  },
  {
    field: "phone",
    headerName: "Phone",
    minWidth: 140,
    flex: 1,
    renderCell: orDash,
  },
  {
    field: "gstin",
    headerName: "GSTIN",
    minWidth: 170,
    flex: 1,
    renderCell: orDash,
  },
];
