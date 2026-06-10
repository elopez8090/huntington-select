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
