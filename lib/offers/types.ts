export type OfferListItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  credits_required: number;
  created_at: string;
};

export type OfferDetail = OfferListItem & {
  status: string;
};
