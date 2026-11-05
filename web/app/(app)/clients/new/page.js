import { Stack } from "@mui/material";
import ClientForm from "@/components/clients/clientForm";
import PageHeader from "@/components/ui/pageHeader";

export const metadata = { title: "New client" };

export default function NewClientPage() {
  return (
    <Stack spacing={3}>
      <PageHeader title="New client" />
      <Stack
        sx={{
          py: 3,
          px: 2,
          borderRadius: 1,
          bgcolor: "background.paper",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        <ClientForm />
      </Stack>
    </Stack>
  );
}
