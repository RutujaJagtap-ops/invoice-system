import { Skeleton, Stack } from "@mui/material";

export default function TableSkeleton({ rows = 6 }) {
  return (
    <Stack spacing={1}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={44} />
      ))}
    </Stack>
  );
}