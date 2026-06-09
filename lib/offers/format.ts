export function shortDescription(text: string, maxLength = 140): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trimEnd()}…`;
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
