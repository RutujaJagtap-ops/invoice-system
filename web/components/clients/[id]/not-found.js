import EmptyState from "@/components/ui/emptyState";

export default function ClientNotFound() {
  return (
    <EmptyState
      title="Client not found"
      description="It may have been deleted, or the link is wrong."
      actionLabel="Back to clients"
      actionHref="/clients"
    />
  );
}
