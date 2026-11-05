"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function RouteDialog({ title, fullPageHref, children }) {
  const router = useRouter();
  const handleClose = () => router.back();

  return (
    <Dialog
      open
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="route-dialog-title"
    >
      <DialogTitle id="route-dialog-title">{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button component="a" href={fullPageHref}>
          Open full page
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
