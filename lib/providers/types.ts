export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type ProviderCategoryRef = {
  id: string;
  name: string;
  slug: string;
};

export type ProviderListItem = {
  id: string;
  slug: string;
  business_name: string;
  short_description: string | null;
  city: string | null;
  state: string | null;
  logo_url: string | null;
  is_featured: boolean;
  categories: ProviderCategoryRef[];
};

export type ProviderDetail = {
  id: string;
  slug: string;
  business_name: string;
  description: string;
  short_description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  categories: ProviderCategoryRef[];
};
