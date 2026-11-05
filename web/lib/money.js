const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const inrCompact = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1,
});

export const formatPaise = (paise) => inr.format(paise / 100);
export const formatINR = (rupees) => formatPaise(toPaise(rupees));
export const formatINRCompact = (rupees) => inrCompact.format(Number(rupees));
export const gstPaise = (subtotalPaise, ratePercent) =>
  Math.round((subtotalPaise * Number(ratePercent)) / 100);

export const toPaise = (rupees) => Math.round((Number(rupees) || 0) * 100);
export const fromPaise = (paise) => paise / 100;
export const lineAmountPaise = (quantity, unitPrice) => Math.round((Number(quantity) || 0) * toPaise(unitPrice));

export function invoiceTotals(items, gstRate) {
  const subtotalPaise = items.reduce((sum, item) => sum + lineAmountPaise(item.quantity, item.unit_price), 0);
  const gstAmountPaise = gstPaise(subtotalPaise, gstRate);
  return { subtotalPaise, gstAmountPaise, totalPaise: subtotalPaise + gstAmountPaise };
}