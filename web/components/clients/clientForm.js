"use client";

import { Alert, Box, Divider, Stack } from "@mui/material";
import FormTextField from "@/components/ui/formTextField";
import LinkButton from "@/components/ui/linkButton";
import SubmitButton from "@/components/ui/submitButton";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { saveClient } from "@/lib/actions/clientActions";
import { validateClient } from "@/lib/validators/client";

const readForm = (form) => Object.fromEntries(new FormData(form));
const UPPERCASE = { htmlInput: { style: { textTransform: "uppercase" } } };

export default function ClientForm({ client }) {
  const { state, formAction, handleSubmit, errors } = useValidatedForm({
    action: saveClient.bind(null, client?.id ?? null),
    validate: validateClient,
    getValues: readForm,
  });
  const defaults = state.values ?? client ?? {};

  return (
    <Box
      component="form"
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      sx={{ width: "100%", maxWidth: 560, mx: "auto", py: 2 }}
    >
      <Stack spacing={2.5}>
        {errors.form && <Alert severity="error">{errors.form}</Alert>}
        <FormTextField
          label="Name"
          name="name"
          defaultValue={defaults.name}
          error={errors.name}
        />
        <FormTextField
          label="Email"
          name="email"
          type="email"
          defaultValue={defaults.email}
          error={errors.email}
        />
        <FormTextField
          label="Phone"
          name="phone"
          defaultValue={defaults.phone}
          error={errors.phone}
        />
        <FormTextField
          label="GSTIN (optional)"
          name="gstin"
          defaultValue={defaults.gstin}
          error={errors.gstin}
          slotProps={UPPERCASE}
        />
        <FormTextField
          label="Address"
          name="address"
          multiline
          minRows={2}
          defaultValue={defaults.address}
          error={errors.address}
        />

        <Divider />

        <Stack direction="row" spacing={2}>
          <LinkButton href={client ? `/clients/${client.id}` : "/clients"}>
            Cancel
          </LinkButton>
          <SubmitButton>{client ? "Save changes" : "Add client"}</SubmitButton>
        </Stack>
      </Stack>
    </Box>
  );
}
