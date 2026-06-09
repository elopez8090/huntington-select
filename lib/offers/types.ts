export type OfferListItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  credits_required: number;
  created_at: string;
  short_description: string | null;
  image_url: string | null;
  featured: boolean;
  merchant_name: string | null;
  expiration_date: string | null;
};

export type OfferDetail = OfferListItem & {
  status: string;
  merchant_website: string | null;
  location: string | null;
  redemption_instructions: string | null;
  terms_and_conditions: string | null;
  updated_at: string;
};
