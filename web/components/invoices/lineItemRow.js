"use client";

import { memo } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Stack, Typography } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FormTextField from "@/components/ui/formTextField";
import { formatPaise, lineAmountPaise } from "@/lib/money";
import { removeItem, updateItem } from "@/store/invoiceDraftSlice";

const DECIMAL_INPUT = { htmlInput: { inputMode: "decimal" } };

function LineItemRow({ item, errors, canRemove }) {
  const dispatch = useDispatch();

  const handleChange = ({ target: { name, value } }) =>
    dispatch(updateItem({ key: item.key, field: name, value }));
  const handleRemove = () => dispatch(removeItem(item.key));

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      sx={{ alignItems: { sm: "flex-start" } }}
    >
      <FormTextField
        label="Description"
        name="description"
        value={item.description}
        onChange={handleChange}
        error={errors?.description}
        sx={{ flex: 3 }}
      />
      <FormTextField
        label="Qty"
        name="quantity"
        value={item.quantity}
        onChange={handleChange}
        error={errors?.quantity}
        slotProps={DECIMAL_INPUT}
        sx={{ flex: 1 }}
      />
      <FormTextField
        label="Rate (₹)"
        name="unit_price"
        value={item.unit_price}
        onChange={handleChange}
        error={errors?.unit_price}
        slotProps={DECIMAL_INPUT}
        sx={{ flex: 1.5 }}
      />
      <Typography
        sx={{ minWidth: 110, pt: { sm: 2 }, textAlign: { sm: "right" } }}
      >
        {formatPaise(lineAmountPaise(item.quantity, item.unit_price))}
      </Typography>
      <IconButton
        onClick={handleRemove}
        disabled={!canRemove}
        aria-label="Remove line item"
        sx={{ mt: { sm: 0.5 } }}
      >
        <DeleteOutlinedIcon />
      </IconButton>
    </Stack>
  );
}

export default memo(LineItemRow);
