import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Register | Huntington Select",
  description: "Create your Huntington Select member account.",
};

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="Join Huntington Select"
      subtitle="Create an account to browse offers and manage your credits."
      footer={
        <>
          <Link href="/" className="text-zinc-900 underline-offset-2 hover:underline">
            Back to home
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
