export interface Space {
  _id: string;
  image_url: string[];
  space_name: string;
  location: string;
  price_per_hour: number;
  space_description: string;
  space_amenities: string[];
  space_type: string;
  max_people: number;
  week_days: string[];
  opening_time: string;
  closing_time: string;
  space_rules: string[];
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  rating?: number;
} 