import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Welcome from '../screens/welcome';
import Login from '../screens/Login';
import Register from '../screens/Register';
import TabRoutes from './tab.routes';

const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator 
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="MainApp" component={TabRoutes} />
        </Stack.Navigator>
    );
}