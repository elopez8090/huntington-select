import type { createClient } from "@/lib/supabase/server";

type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

function slugifyBusinessName(businessName: string): string {
  const base = businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "provider";
}

export async function makeUniqueProviderSlug(
  supabase: ServerSupabase,
  businessName: string,
): Promise<string> {
  const base = slugifyBusinessName(businessName);
  let candidate = base;
  let suffix = 2;

  while (true) {
    const { data, error } = await supabase
      .from("providers")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}
