export const PROVIDER_COVERS_BUCKET = "provider-covers";

/** Matches Next.js default Server Action body limit (1 MB). */
export const MAX_PROVIDER_COVER_BYTES = 1024 * 1024;

export const ALLOWED_PROVIDER_COVER_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function providerCoverObjectPath(providerId: string): string {
  return `${providerId}/cover`;
}

export function getProviderCoverPublicUrl(
  supabaseUrl: string,
  providerId: string,
  cacheBuster?: number,
): string {
  const base = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${PROVIDER_COVERS_BUCKET}/${providerCoverObjectPath(providerId)}`;
  if (cacheBuster === undefined) {
    return base;
  }
  return `${base}?v=${cacheBuster}`;
}
