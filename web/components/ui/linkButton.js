"use client";

import { Button } from "@mui/material";
import NextLink from "@/components/ui/nextLink";

export default function LinkButton(props) {
  return (
    <Button
      component={NextLink}
      {...props}
      sx={{
        background: "linear-gradient(100deg, #7950f2, #405cf5)",
        color: "#fff",
        borderRadius: "14px",
        px: 3.5,
        py: 1.2,
        fontWeight: 600,
        fontSize: "16px",
        textTransform: "none",
        boxShadow: "0 5px 14px rgba(91, 78, 230, 0.25)",
        "&:hover": {
          background: "linear-gradient(100deg, #6840df, #344de0)",
          boxShadow: "0 7px 18px rgba(91, 78, 230, 0.35)",
        },
        ...props.sx,
      }}
    />
  );
}
