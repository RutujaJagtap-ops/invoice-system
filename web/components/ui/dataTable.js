"use client";

import { useMemo } from "react";
import { Paper, alpha } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useUrlParams } from "@/hooks/useUrlParams";

const getGridSx = (theme) => {
  const primary = theme.palette.primary.main;
  const headerBackground = alpha(primary, 0.08);
  const stripeBackground = alpha(primary, 0.035);
  const hoverBackground = alpha(primary, 0.05);
  const dividerColor = alpha(primary, 0.15);

  return {
    border: 0,
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: headerBackground,
      borderBottom: `1px solid ${dividerColor}`,
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: headerBackground,
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: 0.4,
      textTransform: "uppercase",
      color: "#1e2a5a",
    },
    "& .MuiDataGrid-columnSeparator": { display: "none" },
    "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
      {
        outline: "none",
      },
    "& .MuiDataGrid-cell": {
      borderColor: alpha(primary, 0.08),
    },
    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
      outline: "none",
    },
    "& .row-odd": { backgroundColor: "#fff" },
    "& .row-even": { backgroundColor: stripeBackground },
    "& .MuiDataGrid-row:hover": { backgroundColor: hoverBackground },
  };
};

const getRowClassName = ({ indexRelativeToCurrentPage }) =>
  indexRelativeToCurrentPage % 2 === 0 ? "row-odd" : "row-even";

const toSortModel = (ordering) =>
  ordering
    ? [
        {
          field: ordering.replace(/^-/, ""),
          sort: ordering.startsWith("-") ? "desc" : "asc",
        },
      ]
    : [];

const toOrdering = ([sort]) =>
  sort ? `${sort.sort === "desc" ? "-" : ""}${sort.field}` : "";

export default function DataTable({
  rows,
  columns,
  hiddenFields = [],
  pagination,
}) {
  const { searchParams, update, isPending } = useUrlParams();

  const gridColumns = useMemo(
    () => columns.map((column) => ({ sortable: false, ...column })),
    [columns],
  );
  const columnVisibilityModel = Object.fromEntries(
    hiddenFields.map((field) => [field, false]),
  );

  const handlePaginationChange = ({ page }) =>
    update({ page: page > 0 ? String(page + 1) : "" }, { resetPage: false });
  const handleSortChange = (sortModel) =>
    update({ ordering: toOrdering(sortModel) });

  const serverProps = pagination
    ? {
        paginationMode: "server",
        sortingMode: "server",
        rowCount: pagination.rowCount,
        paginationModel: {
          page: (Number(searchParams.get("page")) || 1) - 1,
          pageSize: pagination.pageSize,
        },
        onPaginationModelChange: handlePaginationChange,
        pageSizeOptions: [pagination.pageSize],
        sortModel: toSortModel(searchParams.get("ordering") ?? ""),
        onSortModelChange: handleSortChange,
      }
    : { hideFooter: true, disableColumnSorting: true };

  return (
    <Paper variant="outlined">
      <DataGrid
        rows={rows}
        columns={gridColumns}
        columnVisibilityModel={columnVisibilityModel}
        loading={isPending}
        autoHeight
        disableRowSelectionOnClick
        disableColumnMenu
        getRowClassName={getRowClassName}
        sx={getGridSx}
        {...serverProps}
      />
    </Paper>
  );
}
