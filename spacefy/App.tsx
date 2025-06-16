import NavigationContext from './src/navigation';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { SpaceRegisterProvider } from './src/contexts/SpaceRegisterContext';

export default function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <SpaceRegisterProvider>
          <NavigationContext />
        </SpaceRegisterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}