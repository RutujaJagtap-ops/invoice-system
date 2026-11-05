"use client";

import { Backdrop, Box, CircularProgress } from "@mui/material";

export default function LoadingOverlay({ open = true, contained = false }) {
  const progress = <CircularProgress color="primary" aria-label="Loading" />;

  if (contained) {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          display: "grid",
          placeItems: "center",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          backgroundColor: "rgba(255, 255, 255, 0.4)",
        }}
      >
        {progress}
      </Box>
    );
  }

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backdropFilter: "blur(0.3px)",
        WebkitBackdropFilter: "blur(0.3px)",
        backgroundColor: "rgba(255, 255, 255, 0.12)",
      }}
    >
      {progress}
    </Backdrop>
  );
}
