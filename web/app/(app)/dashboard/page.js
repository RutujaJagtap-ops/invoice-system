import { Suspense } from "react";
import { Box, Stack } from "@mui/material";
import PageHeader from "@/components/ui/pageHeader";
import SummaryCards, {
  SummaryCardsSkeleton,
} from "@/components/dashboard/summaryCards";
import RevenueChart, {
  RevenueChartSkeleton,
} from "@/components/dashboard/revenueChart";
import RecentInvoices, {
  RecentInvoicesSkeleton,
} from "@/components/dashboard/recentInvoices";
import { verifySession } from "@/lib/dal";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await verifySession();

  return (
    <Stack spacing={3}>
      <PageHeader title={"Dashboard"} />
      <Suspense fallback={<SummaryCardsSkeleton />}>
        <SummaryCards />
      </Suspense>
      {/* <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          "& > *": { minWidth: 0 },
        }}
      > */}
      <Suspense fallback={<RevenueChartSkeleton />}>
        <RevenueChart />
      </Suspense>
      <Suspense fallback={<RecentInvoicesSkeleton />}>
        <RecentInvoices />
      </Suspense>
      {/* </Box> */}
    </Stack>
  );
}
