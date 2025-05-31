import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './stack.navigation';

export default function NavigationContext() {
    return(
        <NavigationContainer>
            <StackNavigation />
        </NavigationContainer>
    );
}