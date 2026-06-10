export const PROVIDER_LOGOS_BUCKET = "provider-logos";

/** Matches Next.js default Server Action body limit (1 MB). */
export const MAX_PROVIDER_LOGO_BYTES = 1024 * 1024;

export const ALLOWED_PROVIDER_LOGO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function providerLogoObjectPath(providerId: string): string {
  return `${providerId}/logo`;
}

export function getProviderLogoPublicUrl(
  supabaseUrl: string,
  providerId: string,
  cacheBuster?: number,
): string {
  const base = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${PROVIDER_LOGOS_BUCKET}/${providerLogoObjectPath(providerId)}`;
  if (cacheBuster === undefined) {
    return base;
  }
  return `${base}?v=${cacheBuster}`;
}
