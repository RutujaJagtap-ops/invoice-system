import { Skeleton, Stack } from "@mui/material";
import TableSkeleton from "@/components/ui/tableSkeleton";
import LoadingOverlay from "@/components/ui/loadingOverlay";

export default function InvoicesLoading() {
  return (
    <>
      <Stack spacing={3}>
        <Skeleton variant="text" width={200} height={48} />
        <Skeleton variant="rounded" height={104} />
        <TableSkeleton rows={8} />
      </Stack>
      <LoadingOverlay />
    </>
  );
}