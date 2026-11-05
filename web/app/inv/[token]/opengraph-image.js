import { ImageResponse } from "next/og";
import { getPublicInvoice } from "@/lib/queries";

export const alt = "Invoice summary";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const inrCode = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  currencyDisplay: "code",
});

export default async function OpenGraphImage({ params }) {
  const { token } = await params;
  const invoice = await getPublicInvoice(token);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#3f51b5",
        color: "white",
      }}
    >
      <div style={{ fontSize: 36, opacity: 0.85 }}>{invoice.issuer_name}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 44 }}>{`Invoice ${invoice.number}`}</div>
        <div style={{ fontSize: 96, fontWeight: 700 }}>
          {inrCode.format(Number(invoice.total))}
        </div>
      </div>
      <div
        style={{ fontSize: 32, opacity: 0.85 }}
      >{`Due ${invoice.due_date} · ${invoice.status.toUpperCase()}`}</div>
    </div>,
    size,
  );
}
