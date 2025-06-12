import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type SpaceDetailsParams = {
  space: {
    id: string;
    images: any[];
    title: string;
    address: string;
    price: string;
    rating: number;
    reviews: number;
    description?: string;
    amenities?: string[];
    type?: string;
    area?: string;
    capacity?: string;
    bathrooms?: string;
    hasWifi?: boolean;
  };
};

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  Home: undefined;
  Profile: undefined;
  SpaceDetails: SpaceDetailsParams;
  Settings: undefined;
  MyReservations: undefined;
  Favorites: undefined;
  MyReviews: undefined;
  EditProfile: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; 