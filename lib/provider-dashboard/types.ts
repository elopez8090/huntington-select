export type ProviderDashboardListing = {
  business_name: string;
  status: string;
  featured: boolean;
  city: string | null;
  state: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  short_description: string | null;
};

export type ProviderEditListing = {
  id: string;
  business_name: string;
  short_description: string | null;
  description: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  logo_url: string | null;
};
