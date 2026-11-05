"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

export default function ErrorState({ error, reset }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRetry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h5" component="h1" gutterBottom>Something went wrong</Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        We couldn&apos;t load this page. Check that the API is running and try again.
      </Typography>
      {error.digest && (
        <Typography variant="caption" sx={{ display: "block", color: "text.disabled", mb: 2 }}>
          Reference: {error.digest}
        </Typography>
      )}
      <Button variant="contained" onClick={handleRetry} disabled={isPending}>Try again</Button>
    </Box>
  );
}