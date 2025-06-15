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

export interface RentalSpace {
  _id: string;
  user: string;
  space: {
    location: {
      coordinates: {
        lat: number;
        lng: number;
      };
      formatted_address: string;
      place_id: string;
    };
    _id: string;
    space_name: string;
    max_people: number;
    price_per_hour: number;
    image_url: string[];
  };
  owner: string;
  start_date: string;
  end_date: string;
  startTime: string;
  endTime: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export type CardType = BaseCard | PromoCard | RentalSpace; 