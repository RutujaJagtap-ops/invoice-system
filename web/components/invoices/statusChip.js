import { Chip, alpha } from "@mui/material";

const STATUS_META = {
  draft: { label: "Draft", color: "default" },
  sent: { label: "Sent", color: "info" },
  paid: { label: "Paid", color: "success" },
  overdue: { label: "Overdue", color: "error" },
};

export default function StatusChip({ status, overdue = false }) {
  const { label, color } = STATUS_META[overdue ? "overdue" : status];
  return (
    <Chip
      size="small"
      label={label}
      color={color}
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: 14,
        borderRadius: "6px",
        bgcolor: (theme) =>
          alpha(
            color === "default"
              ? theme.palette.text.secondary
              : theme.palette[color].main,
            0.08,
          ),
        "& .MuiChip-label": {
          px: 1.8,
        },
      }}
    />
  );
}
