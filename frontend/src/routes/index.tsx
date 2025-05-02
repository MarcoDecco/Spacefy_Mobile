import { NavigationContainer } from '@react-navigation/native';
import TabRoutes from './tab.routes';

// direciona o aplicativo para o arquivo tab.routes.tsx dentro da pasta routes
export default function Routes() {
    return (
        <NavigationContainer>
            <TabRoutes />      
        </NavigationContainer>
    );
}