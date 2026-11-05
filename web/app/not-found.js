import { Box } from "@mui/material";
import EmptyState from "@/components/ui/emptyState";

export default function NotFound() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
      <EmptyState
        title="Page not found"
        description="The page you are looking for doesn't exist."
        actionLabel="Go to dashboard"
        actionHref="/dashboard"
      />
    </Box>
  );
}
