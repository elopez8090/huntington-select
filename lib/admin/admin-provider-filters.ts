export type AdminProviderFilter =
  | "all"
  | "approved"
  | "pending"
  | "rejected"
  | "featured";

export const ADMIN_PROVIDER_FILTERS: {
  value: AdminProviderFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
  { value: "featured", label: "Featured" },
];

export function parseAdminProviderFilter(
  value: string | string[] | undefined,
): AdminProviderFilter {
  const raw = Array.isArray(value) ? value[0] : value;
  if (
    raw === "approved" ||
    raw === "pending" ||
    raw === "rejected" ||
    raw === "featured"
  ) {
    return raw;
  }
  return "all";
}

export function sanitizeAdminProviderSearch(
  value: string | string[] | undefined,
): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "";
  return raw.trim().slice(0, 100);
}
