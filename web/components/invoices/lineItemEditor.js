"use client";

import { useDispatch, useSelector } from "react-redux";
import { Button, FormHelperText, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LineItemRow from "@/components/invoices/lineItemRow";
import { addItem } from "@/store/invoiceDraftSlice";

export default function LineItemsEditor({ errors }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.invoiceDraft.items);
  const listError = typeof errors === "string" ? errors : null;
  const itemErrors = Array.isArray(errors) ? errors : [];

  const handleAdd = () => dispatch(addItem());

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Line items</Typography>
      {items.map((item, index) => (
        <LineItemRow key={item.key} item={item} errors={itemErrors[index]} canRemove={items.length > 1} />
      ))}
      {listError && <FormHelperText error>{listError}</FormHelperText>}
      <Button onClick={handleAdd} startIcon={<AddIcon />} sx={{ alignSelf: "flex-start" }}>
        Add item
      </Button>
    </Stack>
  );
}