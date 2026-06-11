import { HomePage } from "@/components/marketing/home-page";
import { getFeaturedProviders } from "@/lib/providers/get-providers";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Huntington Select | Trusted local service providers",
  description:
    "A curated network of vetted contractors and service providers for Huntington homeowners—and a premium place for local pros to join.",
};

export default async function Home() {
  const supabase = await createClient();
  const featuredProviders = await getFeaturedProviders(supabase);

  return <HomePage featuredProviders={featuredProviders} />;
}
