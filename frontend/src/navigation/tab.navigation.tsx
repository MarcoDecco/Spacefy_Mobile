import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from '@expo/vector-icons'
import { useTheme } from '../contexts/ThemeContext';

import Home from '../screens/home';
import Rented from '../screens/rented';
import Favorites from "../screens/favorites";
import Chat from "../screens/chat";
import Profile from "../screens/profile";
import { colors } from "~/styles/globalStyles/colors";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
    const { theme } = useTheme();

    return(
        <Tab.Navigator 
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.blue,
                tabBarInactiveTintColor: theme.gray,
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopColor: theme.border,
                    borderTopWidth: 1,
                },
                tabBarLabelStyle: {
                    color: theme.text,
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({color: color, size: size}) => <Feather name="home" color={color} size={size} />
                }}
            />

            <Tab.Screen
                name="Alugados"
                component={Rented}
                options={{
                    tabBarIcon: ({color: color, size: size}) => <Feather name="book" color={color} size={size} />
                }}
            />

            <Tab.Screen
                name="Favoritos"
                component={Favorites}
                options={{
                    tabBarIcon: ({color: color, size: size}) => <Feather name="heart" color={color} size={size} />
                }}
            />

            <Tab.Screen
                name="Chat"
                component={Chat}
                options={{
                    tabBarIcon: ({color: color, size: size}) => <Feather name="message-circle" color={color} size={size} />
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={Profile}
                options={{
                    tabBarIcon: ({color: color, size: size}) => <Feather name="user" color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
}