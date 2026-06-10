"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  tone?: "zinc" | "stone";
};

const toneClassName = {
  zinc: "text-sm font-medium text-zinc-600 transition hover:text-zinc-900 disabled:opacity-60",
  stone:
    "text-sm font-medium text-stone-600 transition hover:text-stone-900 disabled:opacity-60",
};

export function LogoutButton({ tone = "zinc" }: LogoutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    if (isSigningOut) return;

    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      className={toneClassName[tone]}
    >
      {isSigningOut ? "Signing out…" : "Log out"}
    </button>
  );
}
