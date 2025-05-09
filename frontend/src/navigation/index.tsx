import { NavigationContainer } from "@react-navigation/native";

import TabNavigation from './tab.navigation'

export default function NavigationContext() {
    return(
        <NavigationContainer>
            <TabNavigation />
        </NavigationContainer>
    );
}