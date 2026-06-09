import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in | Huntington Select",
  description: "Sign in to your Huntington Select member account.",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your member dashboard."
      footer={
        <>
          <Link href="/" className="text-zinc-900 underline-offset-2 hover:underline">
            Back to home
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
