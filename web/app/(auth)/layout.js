import { Box, Container } from "@mui/material";

export default function AuthLayout({ children }) {
  return (
    <Box component="main" sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 2 }}>
      <Container maxWidth="xs">{children}</Container>
    </Box>
  );
}