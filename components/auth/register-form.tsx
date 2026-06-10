"use client";

import { FormMessage } from "@/components/auth/form-message";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { getPostLoginRedirectPath } from "@/lib/auth/post-login-redirect";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const inputClassName =
  "mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200";

const MIN_PASSWORD_LENGTH = 6;

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });

    setIsSubmitting(false);

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError));
      return;
    }

    if (data.session) {
      setSuccess("Account created. Redirecting to your dashboard…");
      const destination = await getPostLoginRedirectPath(supabase);
      router.push(destination);
      router.refresh();
      return;
    }

    setSuccess(
      "Account created. Check your email to confirm your address, then sign in.",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error ? <FormMessage variant="error" message={error} /> : null}
      {success ? <FormMessage variant="success" message={success} /> : null}

      <div>
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-zinc-700"
        >
          Email
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-zinc-700"
        >
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClassName}
        />
        <p className="mt-1 text-xs text-zinc-500">
          At least {MIN_PASSWORD_LENGTH} characters
        </p>
      </div>

      <div>
        <label
          htmlFor="register-confirm-password"
          className="block text-sm font-medium text-zinc-700"
        >
          Confirm password
        </label>
        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClassName}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
