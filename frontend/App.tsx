import NavigationContext from '~/navigation';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContext />
      </AuthProvider>
    </ThemeProvider>
  );
}