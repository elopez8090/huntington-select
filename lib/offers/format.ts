export function shortDescription(text: string, maxLength = 140): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function offerCardSummary(
  shortDescriptionField: string | null,
  description: string,
): string {
  const short = shortDescriptionField?.trim();
  if (short) return short;
  return shortDescription(description);
}

export function formatExpirationDate(date: string): string {
  const datePart = date.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) {
    return formatOfferDate(date);
  }
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
    new Date(year, month - 1, day),
  );
}

export function formatExternalHref(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const href = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const parsed = new URL(href);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

export function formatCategoryLabel(category: string): string {
  const normalized = category.trim().replace(/_/g, " ");
  if (!normalized) return "General";
  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatOfferDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
    new Date(iso),
  );
}

export function formatOfferStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
