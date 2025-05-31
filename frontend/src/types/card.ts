export interface BaseCard {
  id: string;
  images: any[];
  title: string;
  address: string;
  price: string;
  rating: number;
  reviews: number;
}

export interface PromoCard extends BaseCard {
  originalPrice: string;
  discount: string;
}

export type CardType = BaseCard | PromoCard; 