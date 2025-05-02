import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import Home from '../screens/Home';
import Rented from '../screens/rented'
import Favoritos from '../screens/Favorites';
import Chat from '../screens/Chat';
import Perfil from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>

            {/**Retona a tela Home */}
            <Tab.Screen
            name="Home"
            component={Home}
            options={{
                tabBarIcon: ({color, size}) => <Feather name="home" color={color} size={size}/>,
            }}
            />

            {/**Retona a tela dos Espaços Alugados */}
            <Tab.Screen
            name="Alugados"
            component={Rented}
            options={{
                tabBarIcon: ({color, size}) => <Feather name="book" color={color} size={size}/>,
            }}
            />

            {/**Retona a tela de Espaços Favoritos */}
            <Tab.Screen
            name="Favoritos"
            component={Favoritos}
            options={{
                tabBarIcon: ({color, size}) => <Feather name="heart" color={color} size={size}/>,
            }}
            />

            {/**Retona a tela de Chat */}
            <Tab.Screen
            name="Chat"
            component={Chat}
            options={{
                tabBarIcon: ({color, size}) => <Feather name="message-circle" color={color} size={size}/>,
            }}
            />

            {/**Retona a tela de Perfil do usuário */}
            <Tab.Screen
            name="Perfil"
            component={Perfil}
            options={{
                tabBarIcon: ({color, size}) => <Feather name="user" color={color} size={size}/>,
            }}
            />
        </Tab.Navigator>
    );
}