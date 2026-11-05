import { Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClientForm from "@/components/clients/clientForm";
import PageHeader from "@/components/ui/pageHeader";
import { getClient } from "@/lib/queries";
import ClientActions from "@/components/clients/clientActions";
import LinkButton from "@/components/ui/linkButton";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const client = await getClient(id);
  return { title: `Edit ${client.name}` };
}

export default async function EditClientPage({ params }) {
  const { id } = await params;
  const client = await getClient(id);

  return (
    <Stack spacing={3}>
      <PageHeader
        title={`Edit ${client.name}`}
        action={
          <Stack direction="row" spacing={1}>
            <LinkButton href="/clients" startIcon={<ArrowBackIcon />}>
              All clients
            </LinkButton>
            <ClientActions clientId={client.id} />
          </Stack>
        }
      />
      <ClientForm client={client} />
    </Stack>
  );
}
