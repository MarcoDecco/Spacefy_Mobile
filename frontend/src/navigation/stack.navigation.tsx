import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigation from './tab.navigation';
import Splash from '../screens/splash';
import Welcome from '../screens/welcome';
import Login from '../screens/login';
import Register from '../screens/register';
import SpaceDetails from '../screens/spaceDetails';
import Settings from '../screens/settings';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="MainApp" component={TabNavigation} />
      <Stack.Screen
        name="SpaceDetails"
        component={SpaceDetails}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
} 