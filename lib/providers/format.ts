export function formatCityState(
  city: string | null,
  state: string | null,
): string | null {
  const parts = [city?.trim(), state?.trim()].filter(Boolean);
  if (parts.length === 0) return null;
  return parts.join(", ");
}

export function formatFullAddress(
  address: string | null,
  city: string | null,
  state: string | null,
  zipCode: string | null,
): string | null {
  const line1 = address?.trim();
  const cityState = formatCityState(city, state);
  const zip = zipCode?.trim();

  const cityLine = [cityState, zip].filter(Boolean).join(" ");
  const segments = [line1, cityLine].filter(Boolean);
  if (segments.length === 0) return null;
  return segments.join(", ");
}

export function providerCardSummary(
  shortDescription: string | null,
  description: string,
): string {
  const short = shortDescription?.trim();
  if (short) return short;
  const trimmed = description.trim();
  if (trimmed.length <= 140) return trimmed;
  return `${trimmed.slice(0, 140).trimEnd()}…`;
}
