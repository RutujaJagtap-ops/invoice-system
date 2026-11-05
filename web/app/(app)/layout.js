import AppShell from "@/components/layout/appShell";
import { verifySession } from "@/lib/dal";

export default async function AppLayout({ children }) {
  const user = await verifySession();
  return <AppShell user={user}>{children}</AppShell>;
}
