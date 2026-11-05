"use client";

import { Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

const handlePrint = () => window.print();

export default function PrintButton({ sx, ...props }) {
  return (
    <Button
      variant="outlined"
      startIcon={<PrintIcon fontSize="small" />}
      onClick={handlePrint}
      sx={{
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
        ...sx,
      }}
      {...props}
    >
      Print / Save as PDF
    </Button>
  );
}
