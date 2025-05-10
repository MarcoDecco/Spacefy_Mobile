import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; 