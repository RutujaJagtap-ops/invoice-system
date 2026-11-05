import { Skeleton, Stack } from "@mui/material";
import LoadingOverlay from "@/components/ui/loadingOverlay";

export default function InvoiceDetailLoading() {
  return (
    <>
      <Stack spacing={3}>
        <Skeleton variant="text" width={280} height={48} />
        <Skeleton variant="rounded" height={520} sx={{ maxWidth: 900 }} />
      </Stack>
      <LoadingOverlay />
    </>
  );
}