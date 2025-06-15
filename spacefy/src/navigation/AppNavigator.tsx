import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import MyReservations from '../screens/myReservations';
import Home from '../screens/home';
import Profile from '../screens/profile';
import SpaceDetails from '../screens/spaceDetails';
import Favorites from '../screens/favorites';
import MyReviews from '../screens/myReviews';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={Home}
        options={{
          title: 'Spacefy',
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={Profile}
        options={{
          title: 'Meu Perfil',
        }}
      />
      <Stack.Screen 
        name="SpaceDetails" 
        component={SpaceDetails}
        options={{
          title: 'Detalhes do Espaço',
        }}
      />
      <Stack.Screen 
        name="Favorites" 
        component={Favorites}
        options={{
          title: 'Favoritos',
        }}
      />
      <Stack.Screen 
        name="MyReviews" 
        component={MyReviews}
        options={{
          title: 'Minhas Avaliações',
        }}
      />
      <Stack.Screen 
        name="MyReservations" 
        component={MyReservations}
        options={{
          title: 'Minhas Reservas',
        }}
      />
    </Stack.Navigator>
  );
} 