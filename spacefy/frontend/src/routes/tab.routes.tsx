import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons'

import Home from '../screens/home';
import Rented from '../screens/rented';
import Favorites from '../screens/favorites';
import Chat from '../screens/chat';
import Profile from '../screens/profile';

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return(
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({color, size}) => <Feather name="home" color={color} size={size} />
            }}
            />
            
            <Tab.Screen
                name="Alugados"
                component={Rented}
                options={{
                    tabBarIcon: ({color, size}) => <Feather name="book" color={color} size={size} />
            }}
            />

            <Tab.Screen
                name="Favoritos"
                component={Favorites}
                options={{
                    tabBarIcon: ({color, size}) => <Feather name="heart" color={color} size={size} />
            }}
            />

            <Tab.Screen
                name="Chat"
                component={Chat}
                options={{
                    tabBarIcon: ({color, size}) => <Feather name="message-circle" color={color} size={size} />
            }}
            />

            <Tab.Screen
                name="Perfil"
                component={Profile}
                options={{
                        tabBarIcon: ({color, size}) => <Feather name="user" color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    )
}