import NavigationContext from '~/navigation';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { useEffect } from 'react';
import { runMigrations } from './src/services/database/migrations';

export default function App() {
  useEffect(() => {
    runMigrations()
      .then(() => console.log('Migrations executadas com sucesso'))
      .catch((error: Error) => console.error('Erro ao executar migrations:', error));
  }, []);

  return (
    <ThemeProvider>
      <NavigationContext />
    </ThemeProvider>
  );
}