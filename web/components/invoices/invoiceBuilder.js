"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, MenuItem, Skeleton, Stack } from "@mui/material";
import ClientAutocomplete from "@/components/clients/clientAutocomplete";
import InvoicePreview from "@/components/invoices/invoicePreview";
import LineItemsEditor from "./lineItemEditor";
import FormTextField from "@/components/ui/formTextField";
import LinkButton from "@/components/ui/linkButton";
import SubmitButton from "@/components/ui/submitButton";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { saveInvoice } from "@/lib/actions/invoiceActions";
import { GST_RATES } from "@/lib/constants";
import { validateInvoice } from "@/lib/validators/invoice";
import {
  loadDraft,
  resetDraft,
  selectDraft,
  setField,
} from "@/store/invoiceDraftSlice";

const DATE_LABEL = { inputLabel: { shrink: true } };

export default function InvoiceBuilder({ initialDraft, issuerName }) {
  const dispatch = useDispatch();
  const draft = useSelector(selectDraft);
  const invoiceId =
    initialDraft.sourceId === "new" ? null : initialDraft.sourceId;

  const { formAction, handleSubmit, errors } = useValidatedForm({
    action: saveInvoice.bind(null, invoiceId),
    validate: validateInvoice,
    getValues: () => draft,
  });

  useEffect(() => {
    dispatch(loadDraft(initialDraft));
    return () => {
      dispatch(resetDraft());
    };
  }, [dispatch, initialDraft]);

  const handleField = ({ target: { name, value } }) =>
    dispatch(setField({ field: name, value }));
  const handleGstChange = ({ target: { value } }) =>
    dispatch(setField({ field: "gst_rate", value: Number(value) }));
  const handleClientChange = (client) =>
    dispatch(setField({ field: "client", value: client }));

  if (draft.sourceId !== initialDraft.sourceId)
    return <Skeleton variant="rounded" height={480} />;

  return (
    <Box
      component="form"
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      sx={{
        display: "grid",
        gap: 3,
        alignItems: "start",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 5fr) minmax(0, 6fr)" },
      }}
    >
      <Stack spacing={3}>
        {errors.form && <Alert severity="error">{errors.form}</Alert>}
        <ClientAutocomplete
          value={draft.client}
          onChange={handleClientChange}
          error={errors.client}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormTextField
            label="Issue date"
            name="issue_date"
            type="date"
            value={draft.issue_date}
            onChange={handleField}
            error={errors.issue_date}
            slotProps={DATE_LABEL}
          />
          <FormTextField
            label="Due date"
            name="due_date"
            type="date"
            value={draft.due_date}
            onChange={handleField}
            error={errors.due_date}
            slotProps={DATE_LABEL}
          />
        </Stack>
        <FormTextField
          select
          label="GST rate"
          name="gst_rate"
          value={draft.gst_rate}
          onChange={handleGstChange}
          error={errors.gst_rate}
        >
          {GST_RATES.map((rate) => (
            <MenuItem key={rate} value={rate}>
              {rate}%
            </MenuItem>
          ))}
        </FormTextField>
        <LineItemsEditor errors={errors.items} />
        <FormTextField
          label="Notes"
          name="notes"
          multiline
          minRows={2}
          value={draft.notes}
          onChange={handleField}
          error={errors.notes}
        />
        <input type="hidden" name="payload" value={JSON.stringify(draft)} />
        <Stack direction="row" spacing={2}>
          <SubmitButton>
            {invoiceId ? "Save changes" : "Create invoice"}
          </SubmitButton>
          <LinkButton href={invoiceId ? `/invoices/${invoiceId}` : "/invoices"}>
            Cancel
          </LinkButton>
        </Stack>
      </Stack>

      <Box sx={{ position: { lg: "sticky" }, top: { lg: 88 } }}>
        <InvoicePreview issuerName={issuerName} />
      </Box>
    </Box>
  );
}
