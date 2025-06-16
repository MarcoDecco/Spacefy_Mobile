export interface Space {
  _id: string;
  image_url: string[];
  space_name: string;
  location: string | {
    coordinates: {
      lat: number;
      lng: number;
    };
    formatted_address: string;
    place_id: string;
  };
  price_per_hour: number;
  space_description: string;
  space_amenities: string[];
  space_type: string;
  max_people: number;
  week_days: string[];
  weekly_days?: Array<{
    day: string;
    time_ranges: Array<{
      open: string;
      close: string;
    }>;
  }>;
  opening_time: string;
  closing_time: string;
  space_rules: string[];
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  owner_id: string;
  rating?: number;
  reviews?: number;
} 