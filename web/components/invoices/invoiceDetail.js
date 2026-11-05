"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Button, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import NextLink from "@/components/ui/nextLink";
import InvoiceDocument from "@/components/invoices/invoiceDocument";
import ConfirmDialog from "@/components/ui/confirmDialogue";
import { useNotify } from "@/hooks/useNotify";
import {
  deleteInvoice,
  markInvoicePaid,
  sendInvoice,
} from "@/lib/actions/invoiceActions";
import PrintButton from "@/components/ui/printButton";

const actionButtonSx = {
  minHeight: 40,
  borderRadius: "10px",
  borderWidth: 1.5,
  borderColor: "#dce3f0",
  bgcolor: "#ffffff",
  color: "#34456b",
  fontWeight: 600,
  fontSize: "0.875rem",
  px: 2.2,
  textTransform: "none",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
  "&:hover": {
    borderColor: "#5968ef",
    bgcolor: "#fbfcfd",
    color: "#5968ef",
    borderWidth: 1.5,
  },
};

export default function InvoiceDetail({ invoice, issuerName }) {
  const notify = useNotify();
  const [isPending, startTransition] = useTransition();
  const [status, setOptimisticStatus] = useOptimistic(invoice.status);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const runAction = (action, { optimisticStatus, successMessage }) =>
    startTransition(async () => {
      if (optimisticStatus) setOptimisticStatus(optimisticStatus);
      const result = await action(invoice.id);
      if (!result) return; // a redirect (delete) never returns
      if (result.ok) notify.success(successMessage);
      else
        notify.error(result.errors.form ?? "Something went wrong. Try again.");
    });

  const handleSend = () =>
    runAction(sendInvoice, {
      optimisticStatus: "sent",
      successMessage: "Invoice marked as sent",
    });
  const handleMarkPaid = () =>
    runAction(markInvoicePaid, {
      optimisticStatus: "paid",
      successMessage: "Invoice marked as paid",
    });
  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);
  const handleDelete = () => {
    setConfirmOpen(false);
    runAction(deleteInvoice, { successMessage: "Invoice deleted" });
  };

  const view = {
    ...invoice,
    status,
    is_overdue: status === "sent" && invoice.is_overdue,
  };

  return (
    <Stack spacing={3}>
      <Stack
        className="no-print"
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        useFlexGap
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          flexWrap: "wrap",
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", alignItems: "center" }}>
          {status !== "paid" && (
            <Button
              component={NextLink}
              href={`/invoices/${invoice.id}/edit`}
              variant="outlined"
              startIcon={<EditIcon fontSize="small" />}
              sx={actionButtonSx}
            >
              Edit
            </Button>
          )}

          {status === "draft" && (
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={isPending}
              startIcon={<SendIcon fontSize="small" />}
              sx={{
                minHeight: 40,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6876f5 0%, #5362e9 100%)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.875rem",
                px: 2.5,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(83, 98, 233, 0.28)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a68e8 0%, #4655d8 100%)",
                  boxShadow: "0 6px 16px rgba(83, 98, 233, 0.35)",
                },
              }}
            >
              Send
            </Button>
          )}

          {status === "sent" && (
            <Button
              variant="contained"
              color="success"
              onClick={handleMarkPaid}
              disabled={isPending}
              startIcon={<CheckCircleIcon fontSize="small" />}
              sx={{
                minHeight: 40,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #20b891 0%, #159b79 100%)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.875rem",
                px: 2.5,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(32, 184, 145, 0.28)",
                "&:hover": {
                  background: "linear-gradient(135deg, #18a783 0%, #108567 100%)",
                  boxShadow: "0 6px 16px rgba(32, 184, 145, 0.35)",
                },
              }}
            >
              Mark as paid
            </Button>
          )}

          {status === "draft" && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleOpenConfirm}
              disabled={isPending}
              startIcon={<DeleteIcon fontSize="small" />}
              sx={{
                minHeight: 40,
                borderRadius: "10px",
                borderWidth: 1.5,
                borderColor: "#fecaca",
                color: "#e11d48",
                bgcolor: "#ffffff",
                fontWeight: 600,
                fontSize: "0.875rem",
                px: 2.2,
                textTransform: "none",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
                "&:hover": {
                  borderColor: "#e11d48",
                  bgcolor: "#fff1f2",
                  borderWidth: 1.5,
                },
              }}
            >
              Delete
            </Button>
          )}

          <PrintButton />
        </Stack>

        <Stack direction="row" sx={{ alignItems: "center" }}>
          <Button
            component={NextLink}
            href="/invoices"
            variant="outlined"
            startIcon={<ArrowBackIcon fontSize="small" />}
            sx={actionButtonSx}
          >
            All invoices
          </Button>
        </Stack>
      </Stack>

      <InvoiceDocument invoice={view} issuerName={issuerName} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this invoice?"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={handleCloseConfirm}
      />
    </Stack>
  );
}
