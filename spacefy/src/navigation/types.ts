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

export type Conversation = {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
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
  Favorites: { from?: string };
  Rented: { from?: string };
  MyReviews: undefined;
  EditProfile: undefined;
  Messages: { conversation: Conversation };
  PaymentTerms: undefined;
  SpaceWelcomeScreen: undefined;
  SpaceInfoScreen: undefined;
  SpaceAddressScreen: undefined;
  SpaceNextStepScreen: undefined;
  SpaceAvailabilityScreen: undefined;
  SpaceImagesScreen: undefined;
  Etapa3: undefined;
  Etapa4: undefined;
  Etapa5: undefined;
  Etapa6: undefined;
  Etapa7: undefined;
  Etapa8: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; 