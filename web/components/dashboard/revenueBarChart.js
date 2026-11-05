"use client";

import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import { formatINR, formatINRCompact } from "@/lib/money";

const Y_AXIS = [
  {
    width: 56,
    tickNumber: 5,
    valueFormatter: formatINRCompact,
    disableLine: true,
    disableTicks: true,
  },
];
const SERIES = [
  {
    dataKey: "total",
    label: "Revenue",
    valueFormatter: formatINR,
    barLabel: ({ value }) => (value ? formatINRCompact(value) : ""),
    barLabelPlacement: "outside",
  },
];
const GRID = { horizontal: true };
const CHART_MARGIN = { top: 32, right: 8, bottom: 4, left: 0 };

function SummaryStat({ label, value, hint }) {
  const statSx = {
    position: "relative",
    flex: "1 1 160px",
    minWidth: 0,
    pl: 2.5,
    pr: 2,
    py: 1.5,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
    transition: "border-color 0.2s, box-shadow 0.2s",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 10,
      top: 12,
      bottom: 12,
      width: 3,
      borderRadius: 1.5,
      bgcolor: "primary.main",
    },
    "&:hover": {
      borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
      boxShadow: (theme) =>
        `0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
    },
  };
  const labelSx = {
    display: "block",
    color: "text.secondary",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    lineHeight: 1.6,
  };
  const valueSx = {
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.3,
    fontVariantNumeric: "tabular-nums",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };
  const hintSx = {
    display: "block",
    color: "text.secondary",
    fontSize: 12,
    fontVariantNumeric: "tabular-nums",
  };

  return (
    <Box sx={statSx}>
      <Typography variant="caption" sx={labelSx}>
        {label}
      </Typography>
      <Typography variant="h6" sx={valueSx}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" sx={hintSx}>
          {hint}
        </Typography>
      )}
    </Box>
  );
}

export default function RevenueBarChart({ data }) {
  const theme = useTheme();
  const { main: primary, dark: primaryDark } = theme.palette.primary;

  const labels = data.map(({ label }) => label);
  const totals = data.map(({ total }) => Number(total) || 0);
  const grandTotal = totals.reduce((sum, total) => sum + total, 0);
  const monthlyAverage = data.length ? Math.round(grandTotal / data.length) : 0;
  const bestIndex = totals.indexOf(Math.max(...totals));
  const bestMonth = data[bestIndex]?.label ?? "—";
  const bestTotal = totals[bestIndex] ?? 0;
  const emptyMonths = labels.filter((_, index) => totals[index] === 0);
  const emptyMonthsNote = emptyMonths.length
    ? `No revenue recorded in ${emptyMonths.join(", ")}`
    : "";

  const barColors = labels.map((_, index) =>
    index === bestIndex ? primaryDark : alpha(primary, 0.85),
  );

  const xAxis = [
    {
      scaleType: "band",
      dataKey: "label",
      categoryGapRatio: 0.55,
      disableLine: true,
      disableTicks: true,
      colorMap: { type: "ordinal", values: labels, colors: barColors },
    },
  ];

  const statsRowSx = { display: "flex", flexWrap: "wrap", gap: 2, mb: 3 };

  const chartSx = {
    "& .MuiChartsAxis-tickLabel": {
      fill: theme.palette.text.secondary,
      fontSize: 12,
      fontWeight: 500,
    },
    "& .MuiChartsGrid-line": {
      stroke: alpha(theme.palette.divider, 0.6),
      strokeDasharray: "3 5",
    },
    "& .MuiBarLabel-root": {
      fill: theme.palette.text.primary,
      fontSize: 12,
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums",
    },
    "& .MuiBarElement-root": {
      transition: "opacity 0.2s, filter 0.2s",
    },
    "&:hover .MuiBarElement-root": {
      opacity: 0.55,
    },
    "& .MuiBarElement-root:hover": {
      opacity: 1,
      filter: "brightness(1.05)",
    },
  };

  return (
    <Box>
      <Box sx={statsRowSx}>
        <SummaryStat
          label="Total"
          value={formatINR(grandTotal)}
          hint={`Last ${data.length} months`}
        />
        <SummaryStat label="Monthly avg" value={formatINR(monthlyAverage)} />
        <SummaryStat
          label="Best month"
          value={bestMonth}
          hint={formatINR(bestTotal)}
        />
      </Box>
      <BarChart
        dataset={data}
        xAxis={xAxis}
        yAxis={Y_AXIS}
        series={SERIES}
        grid={GRID}
        margin={CHART_MARGIN}
        height={300}
        borderRadius={8}
        hideLegend
        sx={chartSx}
      />
      {emptyMonthsNote && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1.5,
            pl: 0.5,
            color: "text.secondary",
            fontStyle: "italic",
          }}
        >
          {emptyMonthsNote}
        </Typography>
      )}
    </Box>
  );
}
