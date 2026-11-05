"use client";

import { useState, useTransition } from "react";
import { Button, Stack } from "@mui/material";
import ConfirmDialog from "@/components/ui/confirmDialogue";
import LinkButton from "@/components/ui/linkButton";
import { useNotify } from "@/hooks/useNotify";
import { deleteClient } from "@/lib/actions/clientActions";

export default function ClientActions({ clientId }) {
  const notify = useNotify();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);
  const handleDelete = () => {
    setConfirmOpen(false);
    startTransition(async () => {
      const result = await deleteClient(clientId);
      if (result && !result.ok)
        notify.error(result.errors.form ?? "Could not delete the client.");
    });
  };

  return (
    <Stack direction="row" spacing={1}>
      <LinkButton href={`/clients/${clientId}/edit`} variant="outlined">
        Edit
      </LinkButton>
      <Button color="error" onClick={handleOpenConfirm} disabled={isPending}>
        Delete
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete this client?"
        message="Clients with invoices cannot be deleted."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={handleCloseConfirm}
      />
    </Stack>
  );
}
