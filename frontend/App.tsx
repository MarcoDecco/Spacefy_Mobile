import NavigationContext from '~/navigation';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContext />
    </ThemeProvider>
  );
}