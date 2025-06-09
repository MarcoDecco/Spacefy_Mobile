export interface Location {
  formatted_address: string;
  place_id: string;
}

export interface BaseCard {
  _id: string;
  id: string;
  space_name: string;
  location: string | Location;
  price_per_hour: number;
  image_url: string[];
  space_type: string;
  space_description: string;
  featured?: boolean;
  promo?: boolean;
}

export interface PromoCard extends BaseCard {
  originalPrice: string;
  discount: string;
}

export type CardType = BaseCard | PromoCard; 