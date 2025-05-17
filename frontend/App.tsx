import NavigationContext from '~/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { globalStyles } from './src/styles/globalStyles/globalStyles';

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={globalStyles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >

        <NavigationContext /> 
      
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}