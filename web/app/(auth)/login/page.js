import { redirect } from "next/navigation";
import { Card, CardContent, Typography } from "@mui/material";
import LoginForm from "@/components/auth/loginForm";
import { getSession } from "@/lib/dal";
import { safeNext } from "@/lib/navigation";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(next);

  return (
    <Card>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Invoice System
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Sign in to manage your invoices.
        </Typography>
        <LoginForm next={next} />
      </CardContent>
    </Card>
  );
}