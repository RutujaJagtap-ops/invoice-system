import {
  Box,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import StatusChip from "@/components/invoices/statusChip";
import { formatDate } from "@/lib/format";
import { formatINR } from "@/lib/money";

export default function InvoiceDocument({ invoice, issuerName }) {
  return (
    <Paper
      className="print-area"
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 4 },
        bgcolor: "#f8fafd",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow:
          "0 8px 24px -4px rgba(24, 39, 75, 0.08), 0 2px 6px -1px rgba(24, 39, 75, 0.04)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #5968ef 0%, #8c98ff 100%)",
        },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          pt: 1,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 800, color: "#17223e", letterSpacing: "-0.02em" }}
          >
            {issuerName}
          </Typography>
          <Typography
            sx={{
              color: "#5968ef",
              fontWeight: 600,
              fontSize: "0.95rem",
              mt: 0.5,
            }}
          >
            Invoice #{invoice.number}
          </Typography>
        </Box>
        <Box>
          <StatusChip status={invoice.status} overdue={invoice.is_overdue} />
        </Box>
      </Stack>

      <Box
        sx={{
          my: 3,
          p: 2.5,
          borderRadius: "12px",
          bgcolor: "#ffffff",
          border: "1px solid #e7ebf3",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2.5,
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.02)",
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "#718096",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: "0.72rem",
              display: "block",
              mb: 0.75,
            }}
          >
            Billed to
          </Typography>
          <Typography
            sx={{ fontWeight: 700, color: "#1a202c", fontSize: "1rem" }}
          >
            {invoice.client_name}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "#718096",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: "0.72rem",
              display: "block",
              mb: 0.75,
            }}
          >
            Issue date
          </Typography>
          <Typography
            sx={{ fontWeight: 600, color: "#2d3748", fontSize: "0.95rem" }}
          >
            {formatDate(invoice.issue_date)}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "#718096",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontSize: "0.72rem",
              display: "block",
              mb: 0.75,
            }}
          >
            Due date
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              color: invoice.is_overdue ? "error.main" : "#2d3748",
              fontSize: "0.95rem",
            }}
          >
            {formatDate(invoice.due_date)}
          </Typography>
        </Box>
      </Box>

      <TableContainer
        sx={{
          my: 3,
          borderRadius: "12px",
          bgcolor: "#ffffff",
          border: "1px solid #e7ebf3",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.02)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f1f4fa" }}>
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#536486",
                  py: 1.5,
                  borderBottom: "1px solid #edf2f7",
                }}
              >
                Description
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#536486",
                  py: 1.5,
                  borderBottom: "1px solid #edf2f7",
                }}
              >
                Qty
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#536486",
                  py: 1.5,
                  borderBottom: "1px solid #edf2f7",
                }}
              >
                Rate
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#536486",
                  py: 1.5,
                  borderBottom: "1px solid #edf2f7",
                }}
              >
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items.map((item, index) => (
              <TableRow
                key={item.id ?? index}
                sx={{
                  "&:hover": { bgcolor: "rgba(89, 104, 239, 0.02)" },
                  "&:last-child td": { borderBottom: 0 },
                }}
              >
                <TableCell
                  sx={{
                    py: 2,
                    fontWeight: 500,
                    color: "#1e293b",
                    borderBottom: "1px solid #edf2f7",
                  }}
                >
                  {item.description}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    py: 2,
                    color: "#475569",
                    fontVariantNumeric: "tabular-nums",
                    borderBottom: "1px solid #edf2f7",
                  }}
                >
                  {Number(item.quantity) ?? 0}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    py: 2,
                    color: "#475569",
                    fontVariantNumeric: "tabular-nums",
                    borderBottom: "1px solid #edf2f7",
                  }}
                >
                  {formatINR(item.unit_price)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    py: 2,
                    fontWeight: 600,
                    color: "#1e293b",
                    fontVariantNumeric: "tabular-nums",
                    borderBottom: "1px solid #edf2f7",
                  }}
                >
                  {formatINR(item.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Box
          sx={{
            width: { xs: "100%", sm: 340 },
            p: 2.5,
            borderRadius: "12px",
            bgcolor: "#ffffff",
            border: "1px solid #e7ebf3",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.02)",
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                Subtotal
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#1e293b",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatINR(invoice.subtotal)}
              </Typography>
            </Stack>

            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                GST ({Number(invoice.gst_rate)}%)
              </Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#1e293b",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatINR(invoice.gst_amount)}
              </Typography>
            </Stack>

            <Divider sx={{ my: 0.5, borderColor: "#e2e8f0" }} />

            <Box
              sx={{
                p: 1.5,
                borderRadius: "8px",
                bgcolor: "rgba(89, 104, 239, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontWeight: 700, color: "#17223e", fontSize: "1.05rem" }}
              >
                Total
              </Typography>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#4655d8",
                  fontSize: "1.25rem",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatINR(invoice.total)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {invoice.notes && (
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: "10px",
            bgcolor: "#ffffff",
            border: "1px solid #e7ebf3",
            borderLeft: "4px solid #5968ef",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#5968ef",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              display: "block",
              mb: 0.5,
            }}
          >
            Notes & Terms
          </Typography>
          <Typography
            sx={{
              color: "#475569",
              fontSize: "0.9rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {invoice.notes}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
