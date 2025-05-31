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
  };
};

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  SpaceDetails: SpaceDetailsParams;
  Settings: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; 