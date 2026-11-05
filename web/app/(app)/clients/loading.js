import { Skeleton, Stack } from "@mui/material";
import LoadingOverlay from "@/components/ui/loadingOverlay";
import TableSkeleton from "@/components/ui/tableSkeleton";

export default function ClientsLoading() {
  return (
    <>
      <Stack spacing={3}>
        <Skeleton variant="text" width={200} height={48} />
        <TableSkeleton rows={8} />
      </Stack>
      <LoadingOverlay />
    </>
  );
}
