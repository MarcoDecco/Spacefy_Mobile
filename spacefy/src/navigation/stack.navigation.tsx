import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigation from './tab.navigation';
import Splash from '../screens/splash';
import Welcome from '../screens/welcome';
import Login from '../screens/login';
import Register from '../screens/register';
import SpaceDetails from '../screens/spaceDetails';
import Settings from '../screens/settings';
import MyReservations from '../screens/myReservations';
import Favorites from '../screens/favorites';
import MyReviews from '../screens/myReviews';
import EditProfile from '../screens/editProfile';
import Messages from '../screens/messages';
import PaymentTerms from '../screens/paymentTerms';
import Rented from '../screens/rented';
import SpaceWelcomeScreen from '../screens/spaceRegister/SpaceWelcomeScreen';
import SpaceInfoScreen from '../screens/spaceRegister/etapas/etapa1';
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
      <Stack.Screen
        name="MyReservations"
        component={MyReservations}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Favorites"
        component={Favorites}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Rented"
        component={Rented}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="MyReviews"
        component={MyReviews}
        options={{
          headerShown: true,
          title: 'Minhas Avaliações',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="PaymentTerms"
        component={PaymentTerms}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="SpaceWelcomeScreen"
        component={SpaceWelcomeScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="SpaceInfoScreen"
        component={SpaceInfoScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
} 