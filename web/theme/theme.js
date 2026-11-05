"use client";

import { createTheme } from "@mui/material/styles";

const PRINT_CSS = `
  @media print {
    .no-print { display: none !important; }
    body { background: #fff; }
    main { padding: 0 !important; }
    .print-area { border: 0 !important; max-width: none !important; }
  }
`;

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#5968ef", dark: "#4655d8", light: "#eef0ff" },
    secondary: { main: "#34456b" },
    success: { main: "#20b891" },
    warning: { main: "#f3ad37" },
    error: { main: "#f35d5b" },
    background: { default: "#f1f4fa", paper: "#ffffff" },
    text: { primary: "#17223e", secondary: "#536486" },
    divider: "#e5eaf3",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    h4: { fontSize: "1.75rem", lineHeight: 1.25, fontWeight: 700, letterSpacing: "-0.04em" },
    h5: { fontSize: "1.35rem", lineHeight: 1.3, fontWeight: 700, letterSpacing: "-0.025em" },
    h6: { fontSize: "1.05rem", lineHeight: 1.35, fontWeight: 650, letterSpacing: "-0.02em" },
    body2: { lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          borderColor: "#e7ebf3",
          borderRadius: 14,
          boxShadow: "0 2px 10px rgba(27, 44, 80, 0.025)",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 22,
          "&:last-child": { paddingBottom: 22 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 9, minHeight: 38 },
        containedPrimary: {
          background: "linear-gradient(135deg, #6876f5 0%, #5362e9 100%)",
          "&:hover": { background: "linear-gradient(135deg, #5d6be9 0%, #4655d8 100%)" },
        },
        outlined: {
          borderColor: "#dce3f0",
          "&:hover": { borderColor: "#bbc7df", backgroundColor: "#f7f8fc" },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          "&:hover": { backgroundColor: "rgba(89, 104, 239, 0.08)" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          backgroundColor: "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dfe5f0" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#b7c3dc" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: 1, borderColor: "#5968ef" },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          color: "#17223e",
          "--DataGrid-containerBackground": "#f0f3f9",
          "--DataGrid-rowBorderColor": "#e6ebf3",
        },
        columnHeaders: {
          backgroundColor: "#f0f3f9",
          borderBottomColor: "#e6ebf3",
          fontWeight: 600,
        },
        cell: { borderBottomColor: "#e6ebf3" },
        row: {
          "&:hover": { backgroundColor: "#f7f8fc" },
          "&.Mui-selected": { backgroundColor: "rgba(89, 104, 239, 0.07)" },
          "&.Mui-selected:hover": { backgroundColor: "rgba(89, 104, 239, 0.11)" },
        },
      },
    },
  },
});

export default theme;
