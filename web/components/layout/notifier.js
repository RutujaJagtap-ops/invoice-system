"use client";

import { useDispatch, useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import { dismissNotification } from "@/store/uiSlice";

export default function Notifier() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);

  const handleClose = (_event, reason) => {
    if (reason !== "clickaway") dispatch(dismissNotification());
  };

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={notification?.severity ?? "info"} variant="filled" onClose={handleClose}>
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}