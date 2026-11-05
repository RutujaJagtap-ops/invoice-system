import { Box } from "@mui/material";
import EmptyState from "@/components/ui/emptyState";

export default function PublicInvoiceNotFound() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <EmptyState
        title="Invoice not found"
        description="This link is invalid or the invoice is no longer shared."
      />
    </Box>
  );
}
