import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { getDashboardSummary } from "@/lib/queries";
import { formatINR } from "@/lib/money";
import LoadingOverlay from "@/components/ui/loadingOverlay";

const STAT_GRID = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, 1fr)",
    lg: "repeat(4, 1fr)",
  },
};

const CARD_RADIUS = 1.5;
const ICON_TILE_BACKGROUNDS = {
  primary: "rgba(89, 104, 239, 0.12)",
  warning: "rgba(243, 173, 55, 0.14)",
  error: "rgba(243, 93, 91, 0.12)",
  success: "rgba(32, 184, 145, 0.14)",
};

const CARD_SHADOW =
  "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.05)";
const CARD_SHADOW_HOVER = "0 12px 32px rgba(15, 23, 42, 0.10)";

function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  tone = "primary",
  color = "text.primary",
}) {
  const toneColor = `${tone}.main`;

  const cardSx = {
    position: "relative",
    overflow: "hidden",
    borderRadius: CARD_RADIUS,
    border: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    boxShadow: CARD_SHADOW,
    transition: "box-shadow 0.2s, transform 0.2s",
    "&:hover": { boxShadow: CARD_SHADOW_HOVER, transform: "translateY(-3px)" },
  };

  const accentBarSx = {
    position: "absolute",
    inset: "0 0 auto 0",
    height: 3,
    bgcolor: toneColor,
    opacity: 0.85,
  };

  const iconTileSx = {
    width: 52,
    height: 52,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: 1.5,
    color: toneColor,
    bgcolor: ICON_TILE_BACKGROUNDS[tone],
  };

  const labelSx = {
    color: "text.secondary",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  const valueSx = {
    color,
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  };

  const captionRowSx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mt: 2,
    pt: 1.5,
    borderTop: "1px dashed",
    borderColor: "divider",
  };

  const captionDotSx = {
    width: 6,
    height: 6,
    flexShrink: 0,
    borderRadius: "50%",
    bgcolor: toneColor,
  };

  return (
    <Card elevation={0} sx={cardSx}>
      <Box sx={accentBarSx} />
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={iconTileSx}>
            <Icon sx={{ fontSize: 26 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" noWrap sx={labelSx}>
              {label}
            </Typography>
            <Typography variant="h5" noWrap sx={valueSx}>
              {value}
            </Typography>
          </Box>
        </Box>
        <Box sx={captionRowSx}>
          <Box sx={captionDotSx} />
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            {caption}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={STAT_GRID}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton
            key={index}
            variant="rounded"
            height={132}
            sx={{ borderRadius: CARD_RADIUS }}
          />
        ))}
      </Box>
      <LoadingOverlay contained />
    </Box>
  );
}

export default async function SummaryCards() {
  const summary = await getDashboardSummary();
  const { counts } = summary;

  return (
    <Box sx={STAT_GRID}>
      <StatCard
        label="Outstanding"
        value={formatINR(summary.outstanding)}
        caption={`${counts.sent} sent invoices`}
        icon={HourglassEmptyRoundedIcon}
        tone="warning"
      />
      <StatCard
        label="Overdue"
        value={formatINR(summary.overdue_amount)}
        caption={`${summary.overdue_count} past due date`}
        color="error.main"
        icon={AccountBalanceWalletOutlinedIcon}
        tone="error"
      />
      <StatCard
        label="Paid this month"
        value={formatINR(summary.paid_this_month)}
        caption={`${counts.paid} paid in total`}
        color="success.main"
        icon={PaymentsOutlinedIcon}
        tone="success"
      />
      <StatCard
        label="Drafts"
        value={counts.draft}
        caption="Not sent yet"
        icon={DescriptionOutlinedIcon}
        tone="primary"
      />
    </Box>
  );
}
