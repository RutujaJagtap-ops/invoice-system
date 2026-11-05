"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@mui/material";

export default function SubmitButton({ children, ...props }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" disabled={pending} {...props}>
      {pending ? "Saving…" : children}
    </Button>
  );
}