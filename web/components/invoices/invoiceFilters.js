"use client";

import { Stack, Tab, Tabs } from "@mui/material";
import SearchField from "@/components/ui/searchField";
import LoadingOverlay from "@/components/ui/loadingOverlay";
import { useUrlParams } from "@/hooks/useUrlParams";
import { INVOICE_STATUS_TABS } from "@/lib/constants";

const getTabsSx = (theme) => {
  const primary = theme.palette.primary.main;
  const dividerColor = "#e3e7f3";
  const idleText = "#7b83a3";
  const hoverText = "#1e2a5a";

  return {
    minHeight: 0,
    borderBottom: `1px solid ${dividerColor}`,
    "& .MuiTabs-flexContainer": { gap: 3 },
    "& .MuiTabs-indicator": {
      height: 3,
      borderRadius: "3px 3px 0 0",
      backgroundColor: primary,
    },
    "& .MuiTab-root": {
      minHeight: 44,
      minWidth: 0,
      px: 2.5,
      py: 1,
      textTransform: "none",
      fontSize: 16.5,
      fontWeight: 500,
      letterSpacing: 0.2,
      color: idleText,
      transition: "color 0.2s ease",
    },
    "& .MuiTab-root:hover": {
      color: hoverText,
    },
    "& .MuiTab-root.Mui-selected": {
      color: primary,
      fontWeight: 700,
    },
    "& .MuiTab-root.Mui-focusVisible": {
      outline: `2px solid ${primary}`,
      outlineOffset: 2,
      borderRadius: 1,
    },
  };
};
export default function InvoiceFilters() {
  const { searchParams, update, isPending } = useUrlParams();
  const rawStatus = searchParams.get("status");
  const status = INVOICE_STATUS_TABS.some((tab) => tab.value === rawStatus)
    ? rawStatus
    : "all";

  const handleStatusChange = (_event, value) =>
    update({ status: value === "all" ? "" : value });

  return (
    <Stack spacing={2}>
      <Tabs
        value={status}
        onChange={handleStatusChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Filter by status"
        sx={getTabsSx}
      >
        {INVOICE_STATUS_TABS.map(({ value, label }) => (
          <Tab key={value} value={value} label={label} disableRipple />
        ))}
      </Tabs>
      <SearchField placeholder="Search by invoice number or client" />
      <LoadingOverlay open={isPending} />
    </Stack>
  );
}
