import { Card, CardContent, Skeleton, Typography } from "@mui/material";
import RevenueBarChart from "@/components/dashboard/revenueBarChart";
import { formatMonth } from "@/lib/format";
import { getDashboardSummary } from "@/lib/queries";

export function RevenueChartSkeleton() {
  return <Skeleton variant="rounded" height={320} />;
}

export default async function RevenueChart() {
  const { monthly_revenue: months } = await getDashboardSummary();
  const data = months.map(({ month, total }) => ({
    label: formatMonth(month),
    total: Number(total),
  }));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Revenue, last 6 months
        </Typography>
        <RevenueBarChart data={data} />
      </CardContent>
    </Card>
  );
}
