export type AdminDashboardStats = {
  totalProviders: number;
  pendingApplications: number;
  approvedProviders: number;
  categoryCount: number;
};

export type ProviderApplicationRow = {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  city: string;
  status: string;
  submitted_at: string;
  category_name: string;
};

export type AdminProviderStats = {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  featured: number;
};

export type AdminProviderRow = {
  id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  slug: string;
  city: string | null;
  state: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
};
