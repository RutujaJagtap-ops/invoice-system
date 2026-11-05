import EmptyState from "@/components/ui/emptyState";

export default function InvoiceNotFound() {
  return (
    <EmptyState
      title="Invoice not found"
      description="It may have been deleted, or the link is wrong."
      actionLabel="Back to invoices"
      actionHref="/invoices"
    />
  );
}
