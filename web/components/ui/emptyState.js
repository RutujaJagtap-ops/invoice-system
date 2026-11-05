import { Box, Button, Typography } from "@mui/material";
import NextLink from "@/components/ui/nextLink";

export default function EmptyState({ title, description, actionLabel, actionHref }) {
  return (
    <Box sx={{ textAlign: "center", py: 6, px: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>{title}</Typography>
      {description && <Typography sx={{ color: "text.secondary", mb: 2 }}>{description}</Typography>}
      {actionHref && (
        <Button component={NextLink} href={actionHref} variant="outlined">{actionLabel}</Button>
      )}
    </Box>
  );
}