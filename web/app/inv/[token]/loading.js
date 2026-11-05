import { Container, Skeleton, Stack } from "@mui/material";
import LoadingOverlay from "@/components/ui/loadingOverlay";

export default function PublicInvoiceLoading() {
  return (
    <>
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 5 } }}>
        <Stack spacing={3}>
          <Skeleton variant="text" width={280} height={48} />
          <Skeleton variant="rounded" height={520} />
        </Stack>
      </Container>
      <LoadingOverlay />
    </>
  );
}
